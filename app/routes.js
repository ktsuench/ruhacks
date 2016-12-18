// place models here to build api
var pg = require('pg');
var db = require('../config/db');
var session = require('express-session');
var crypto = require('crypto');

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
        var arbitraryUrls = ['pages', 'api', 'draft', 'login'];
        
        if (arbitraryUrls.indexOf(req.url.split('/')[1]) > -1) {
            next();
        } else {
            res.render('index');
        }
    });

    // Temporary Route
    app.get('/draft', function(req, res, next) {
        res.render('draft');
    });

    // server routes =================================================
    app.get('/login', function(req, res, next) {
        res.render('login');
    });
    // handle things like api calls

    // subscriber mailing list routes
    {
        // return all subscribers of mailing list
        /*app.get('/api/mailingList', function(req, res) {
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
        });*/

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
        /*app.delete('/api/mailingList', function(req, res) {
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
        });*/
    }

    // frontend routes =================================================
    app.get('/pages/*', function(req, res, next) {
        res.render('.' + req.path);
    });
};