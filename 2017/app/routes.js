// place models here to build api
var pg = require('pg');
var db = require('../config/db');
var session = require('express-session');
var crypto = require('crypto');
//var mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: "ruhacks.com"});
var Readable = require("stream").Readable;

module.exports = function(app) {
    // route set up
    app.set('views', '2017/public/views');
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
            if (err){
                console.log(err);
                res.status(err.status).end();
            }
        });
    });

    // route to handle all angular requests
    app.all('/*', function(req, res, next) {
        var arbitraryUrls = ['pages', 'api', 'draft', 'login', 'dash', 'mailingList'];
        
        if (arbitraryUrls.indexOf(req.url.split('/')[1]) > -1) {
            next();
        } else {
            res.render('index');
        }
    });

    // server routes =================================================
    // handle things like api calls

    // authentication routes
    {
        // check if user is logged in
        /*app.get('/api/auth', function(req, res) {
            if (req.session.hasOwnProperty('authenticated')){
                res.json({authenticated: req.session.authenticated});
            } else {
                res.json({authenticated: false});
            }
        });*/

        // check if user exists
        app.post('/api/auth', function(req, res) {
            // connect to db
            var client = new pg.Client(db.url);
            
            client.connect(function(err) {
                if (err) {
                    console.log(err);
                    throw err;
                }            
            });

            // start query to db
            client.query("SELECT * FROM userList WHERE username='" + req.body.username + "';", function(err, result) {
                if (err) {
                    console.log(err);
                    throw err;
                }

                var hash = crypto.createHash('SHA256');
                var pass = hash.update(req.body.pass).digest('base64');

                // Check that result.rows array is defined and compare password hashes
                if (result.rows.length > 0 && pass.trim() == result.rows[0].hash.trim()) {
                    req.session.authenticated = true;
                    res.json({valid: true});
                } else {
                    res.json({valid: false});
                }

                // end connection to db
                client.end(function(err) {
                    if (err) throw err;
                });
            });

            //res.sendStatus(200);
        });

        // log user out if they are logged in, otherwise send HTTP response 404
        app.get('/api/logout', function(req, res) {
            if (req.session.hasOwnProperty('authenticated') && req.session.authenticated){
                req.session.destroy(function(err){
                    if (err) throw err;
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
            if (req.session.hasOwnProperty('authenticated') && req.session.authenticated){
                res.redirect('/2017/dash');
            } else {
                res.render('login');
            }
        });

        // handle dashboard landing page route
        app.get('/dash', function(req, res){
            checkAuthElseRender(req, res, 'pages/dash/index');
        });

        // handle dashbaord subscribers page route
        app.get('/dash/subscribers', function(req, res){
            checkAuthElseRender(req, res, 'pages/dash/subscribers');
        });

        // handle dashbaord mail page route
        /*app.get('/dash/mail', function(req, res){
            checkAuthElseRender(req, res, 'pages/dash/mail');
        });*/

        // handle dashbaord mail page route
        /*app.get('/dash/users', function(req, res){
            checkAuthElseRender(req, res, 'pages/dash/users');
        });*/

        // handle catch all dashboard check to see if user is logged in
        app.get('/dash/*', function(req, res){
            if (req.session.hasOwnProperty('authenticated') && req.session.authenticated){
                res.render('pages/dash');
            } else {
                res.redirect('/2017/login');
            }
        });
    }

    // subscriber mailing list routes
    {
        // return all subscribers of mailing list
        app.get('/api/mailingList', function(req, res) {
            //console.log(req.body);

            if (req.session.hasOwnProperty('authenticated') && req.session.authenticated) {
                // connect to db
                var client = new pg.Client(db.url);
                
                client.connect(function(err) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }            
                });

                // start query to db
                client.query("SELECT * FROM mailingList;", function(err, result) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }

                    //console.log(result.rows);
                    res.json(result.rows);

                    // end connection to db
                    client.end(function(err) {
                        if (err) throw err;
                    });
                });
            } else {
                // Send Client Error Forbidden Status Code
                //res.sendStatus(403);
                res.redirect('/2017');
            }
        });

        // add new subscriber to mailing list
        app.post('/api/mailingList', function(req, res) {
            //console.log(req.body);

            // connect to db
            /*var client = new pg.Client(db.url);
            
            client.connect(function(err) {
                if (err) {
                    console.log(err);
                    throw err;
                }            
            });

            // start query to db, check if email already is subscribed
            client.query("SELECT * FROM mailingList WHERE email='" + req.body.email + "';", function(err, result) {
                if (err) throw err;

                if (result.rowCount < 1){
                    client.query("INSERT INTO mailingList(email) VALUES ('" + req.body.email + "');", function(err, result) {
                        if (err) {
                            console.log(err);
                            throw err;
                        }

                        //console.log(result.rows);
                        res.json({result: 'added'});

                        // end connection to db
                        client.end(function(err) {
                            if (err) throw err;
                        });
                    });
                } else {
                    res.json({result: 'duplicate'});

                    // end connection to db
                    client.end(function(err) {
                        if (err) throw err;
                    });
                }
            });*/
            
            //res.sendStatus(200);
            res.sendStatus(400);
        });

        // delete a subscriber from mailing list
        app.delete('/api/mailingList', function(req, res) {
            //console.log(req.query);

            if (req.session.hasOwnProperty('authenticated') && req.session.authenticated) {
                // connect to db
                var client = new pg.Client(db.url);
                
                client.connect(function(err) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }            
                });

                // start query to db
                client.query("DELETE FROM mailingList WHERE email='" + req.query.email + "';", function(err, result) {
                    if (err) {
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
            } else {
                // Send Client Error Forbidden Status Code
                //res.sendStatus(403);
                res.redirect('/2017');
            }
        });

        // Sending csv of subscribers
        app.get('/mailingList', function(req, res) {
            if (req.session.hasOwnProperty('authenticated') && req.session.authenticated) {
                // connect to db
                var client = new pg.Client(db.url);
                
                client.connect(function(err) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }            
                });

                // start query to db
                client.query("SELECT * FROM mailingList;", function(err, result) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }

                    var csvString = "";

                    //console.log(result.rows);
                    
                    // Put all email addresses into csv string format
                    result.rows.forEach(function(subscriber, index) {
                        csvString += subscriber.email.trim();

                        if (index < result.rows.length - 1) {
                            csvString += ",\n";
                        }
                    });

                    // Turn csv string into a stream
                    var csvStream = new Readable;
                    csvStream.push(csvString);
                    csvStream.push(null);

                    // Send csv stream to client as csv file
                    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
                    res.setHeader("Content-Type", "text/csv");
                    csvStream.pipe(res);

                    // end connection to db
                    client.end(function(err) {
                        if (err) throw err;
                    });
                });
            } else {
                // Send Client Error Forbidden Status Code
                //res.sendStatus(403);
                res.redirect('/2017');
            }
        });
    }

    // mailing list routes
    {
        // EXPERIMENTAL
        
        /*app.post('/api/hackersMailingList', function(req, res) {
            console.log(req.body);
            var email = req.body;

            // Condition 1
            //if (email.from.toLowerCase().indexOf("ress.ca") > -1) {
            // Condition 2
            if (email.from.toLowerCase() === "ruhacks@ress.ca") {
                var emailBlast = {};

                emailBlast.from = "RU Hacks 2017 Team <organizers@ruhacks.com>";
                emailBlast.to = "mailingtest@ruhacks.com";
                
                if (email.hasOwnProperty("cc")) emailBlast.cc = "," + email.cc;
                if (email.hasOwnProperty("bcc")) emailBlast.bcc = "," + email.bcc;
                
                emailBlast.subject = email.subject;
                emailBlast.text = email["body-plain"];
                emailBlast.html = email["body-html"];
                
                if(email.hasOwnProperty("attachments")) {
                    emailBlast.attachment = [];

                    // @todo need to figure out how to get attachments to send properly

                    JSON.parse(email.attachments).forEach(function(attch, index) {                        
                        var attachment = new mailgun.Attachment({
                            data: request(attch.url).auth('api', process.env.MAILGUN_API_KEY),
                            filename: attch.name,
                            knownLength: attch.size,
                            contentType: attch["content-type"]
                        });

                        emailBlast.attachment.push(body);
                    });
                }
                    
                console.log("Email to be sent:");
                console.log(emailBlast);

                mailgun.messages().send(emailBlast, function(err, result) {
                    if (err) {
                        console.log("Failed to send email");
                        console.log(err);
                    }

                    console.log(result);
                });
            }
            
            res.sendStatus(200);
        });*/
    }

    // frontend routes =================================================
    app.get('/pages/*', function(req, res, next) {
        res.render('.' + req.path);
    });
};

function checkAuthElseRender(req, res, pageToRender) {
    if (req.session.hasOwnProperty('authenticated') && req.session.authenticated){
        res.render(pageToRender);
    } else {
        res.redirect('/2017/login');
    }
}