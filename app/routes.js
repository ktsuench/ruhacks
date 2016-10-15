// place models here to build api
var pg = require('pg');
var db = require('../config/db');
var session = require('express-session');
var crypto = require('crypto');
var mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

module.exports = function(app) {
    // route set up
    app.set('views', 'public/views');
    app.set('view engine', 'pug');

    // route to return social media image
    app.get('/img/og_twitter.png', function(req, res){
        var options = {
            root: __dirname + '/../public/img/',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        res.sendFile('og_twitter.png', options, function(err){
            if(err){
                console.log(err);
                res.status(err.status).end();
            }
        });
    });

    // route to handle all angular requests
    app.all('/*', function(req, res, next) {
        var arbitraryUrls = ['pages', 'api', 'login', 'dash', 'home'];
        
        if (arbitraryUrls.indexOf(req.url.split('/')[1]) > -1) {
            next();
        } else {
            res.render('landing');
        }
    });

    // temporary route
    app.get('/home', function(req, res){
        res.render('pages/home');
    });

    // server routes =================================================
    // handle things like api calls
    
    // authentication routes
    {
        // check if user is logged in
        app.get('/api/auth', function(req, res) {
            if(req.session.hasOwnProperty('authenticated')){
                res.json({authenticated: req.session.authenticated});
            } else {
                res.json({authenticated: false});
            }
        });

        // check if user exists
        app.post('/api/auth', function(req, res) {
            // connect to db
            var client = new pg.Client(db.url);
            
            client.connect(function(err) {
                if(err) {
                    console.log(err);
                    throw err;
                }            
            });

            // start query to db
            client.query("SELECT * FROM userList WHERE username='" + req.body.username + "';", function(err, result) {
                if(err) {
                    console.log(err);
                    throw err;
                }

                var hash = crypto.createHash('SHA256');
                var pass = hash.update(req.body.pass).digest('base64');

                // Check that result.rows array is defined and compare password hashes
                if(result.rows.length > 0 && pass.trim() == result.rows[0].hash.trim()) {
                    req.session.authenticated = true;
                    res.json({valid: true});
                } else {
                    res.json({valid: false});
                }

                // end connection to db
                client.end(function(err) {
                    if(err) throw err;
                });
            });

            //res.sendStatus(200);
        });

        // log user out if they are logged in, otherwise send HTTP response 404
        app.get('/api/logout', function(req, res) {
            if(req.session.authenticated){
                req.session.destroy(function(err){
                    if(err) throw err;
                });
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        });
    }

    // dashboard routes
    {
        // handle login route
        app.get('/login', function(req, res){
            //res.render('index');
            if(req.session.hasOwnProperty('authenticated')){
                res.redirect('/dash');
            } else {
                res.render('pages/login');
            }
        });

        // handle dashbaord landing page route
        app.get('/dash', function(req, res){
            //res.render('index');
            if(req.session.hasOwnProperty('authenticated')){
                res.render('pages/dash');
            } else {
                res.redirect('/login');
            }
        });

        // handle catch all dashboard check to see if user is logged in
        app.get('/dash/*', function(req, res){
            //res.render('index');
            if(req.session.hasOwnProperty('authenticated')){
                res.render('pages/dash');
            } else {
                res.redirect('/login');
            }
        });
    }

    // subscriber mailing list routes
    {
        // return all subscribers of mailing list
        app.get('/api/mailingList', function(req, res) {
            //console.log(req.body);

            // connect to db
            var client = new pg.Client(db.url);
            
            client.connect(function(err) {
                if(err) {
                    console.log(err);
                    throw err;
                }            
            });

            // start query to db
            client.query("SELECT * FROM mailingList;", function(err, result) {
                if(err) {
                    console.log(err);
                    throw err;
                }

                //console.log(result.rows);
                res.json(result.rows);

                // end connection to db
                client.end(function(err) {
                    if(err) throw err;
                });
            });

            //res.sendStatus(500);
        });

        // add new subscriber to mailing list
        app.post('/api/mailingList', function(req, res) {
            //console.log(req.body);

            // connect to db
            var client = new pg.Client(db.url);
            
            client.connect(function(err) {
                if(err) {
                    console.log(err);
                    throw err;
                }            
            });

            // start query to db, check if email already is subscribed
            client.query("SELECT * FROM mailingList WHERE email='" + req.body.email + "';", function(err, result) {
                if(err) throw err;

                if(result.rowCount < 1){
                    client.query("INSERT INTO mailingList(email) VALUES ('" + req.body.email + "');", function(err, result) {
                        if(err) {
                            console.log(err);
                            throw err;
                        }

                        //console.log(result.rows);
                        res.json({result: 'added'});

                        // end connection to db
                        client.end(function(err) {
                            if(err) throw err;
                        });
                    });
                } else {
                    res.json({result: 'duplicate'});

                    // end connection to db
                    client.end(function(err) {
                        if(err) throw err;
                    });
                }
            });
            
            //res.sendStatus(200);
        });

        // delete a subscriber from mailing list
        app.delete('/api/mailingList', function(req, res) {
            //console.log(req.query);

            // connect to db
            var client = new pg.Client(db.url);
            
            client.connect(function(err) {
                if(err) {
                    console.log(err);
                    throw err;
                }            
            });

            // start query to db
            client.query("DELETE FROM mailingList WHERE email='" + req.query.email + "';", function(err, result) {
                if(err) {
                    console.log(err);
                    throw err;
                }

                //console.log(result.rows);

                // end connection to db
                client.end(function(err) {
                    if(err) throw err;
                });
            });

            res.sendStatus(200);
        });
    }

    // mail handling routes (list, recieve, send, delete)
    {
        app.post('/api/mail/recieve', function(req, res) {
            console.log("Recieved mail");
            console.log(req.body);

            /*// connect to db
            var client = new pg.Client(db.url);
            
            client.connect(function(err) {
                if(err) {
                    console.log(err);
                    throw err;
                }            
            });

            // start query to db, check if email already is subscribed
            client.query("SELECT * FROM mailingList WHERE email='" + req.body.email + "';", function(err, result) {
                if(err) throw err;

                if(result.rowCount < 1){
                    client.query("INSERT INTO mailingList(email) VALUES ('" + req.body.email + "');", function(err, result) {
                        if(err) {
                            console.log(err);
                            throw err;
                        }

                        //console.log(result.rows);
                        res.json({result: 'added'});

                        // end connection to db
                        client.end(function(err) {
                            if(err) throw err;
                        });
                    });
                } else {
                    res.json({result: 'duplicate'});

                    // end connection to db
                    client.end(function(err) {
                        if(err) throw err;
                    });
                }
            });
            
            //*/res.sendStatus(200);
        });

        app.get('/api/mail/send', function(req, res) {
            console.log("Sent mail");
            //console.log(req.body);

            /*// connect to db
            var client = new pg.Client(db.url);
            
            client.connect(function(err) {
                if(err) {
                    console.log(err);
                    throw err;
                }            
            });

            // start query to db, check if email already is subscribed
            client.query("SELECT * FROM mailingList WHERE email='" + req.body.email + "';", function(err, result) {
                if(err) throw err;

                if(result.rowCount < 1){
                    client.query("INSERT INTO mailingList(email) VALUES ('" + req.body.email + "');", function(err, result) {
                        if(err) {
                            console.log(err);
                            throw err;
                        }

                        //console.log(result.rows);
                        res.json({result: 'added'});

                        // end connection to db
                        client.end(function(err) {
                            if(err) throw err;
                        });
                    });
                } else {
                    res.json({result: 'duplicate'});

                    // end connection to db
                    client.end(function(err) {
                        if(err) throw err;
                    });
                }
            });
            
            */
            
            var data = {
                from: 'Excited User <helloworld@ruhacks.com>',
                to: 'will289@hotmail.com',
                subject: 'Hello',
                text: 'Testing some Mailgun awesomness!'
            };
             
            mailgun.messages().send(data, function (error, body) {
              console.log(body);
            });
            
            res.sendStatus(200);
        });
    }

    // frontend routes =================================================
    app.get('/pages/*', function(req, res, next) {
        res.render('.' + req.path);
    });
};
