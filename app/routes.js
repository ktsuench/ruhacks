// place models here to build api
var pg = require('pg');
var db = require('../config/db');
var session = require('express-session');
var crypto = require('crypto');

module.exports = function(app) {
    // route to handle all angular requests
    app.set('views', 'public/views');
    app.set('view engine', 'pug');

    app.all('/*', function(req, res, next) {
        var arbitraryUrls = ['pages', 'api', 'login', 'dash'];
        
        if (arbitraryUrls.indexOf(req.url.split('/')[1]) > -1) {
            next();
        } else {
            res.render('landing');
        }
    });

    // temporary
    app.get('/login', function(req, res){
        res.render('index');
    });

    app.get('/dash', function(req, res){
        res.render('index');
    });

    // server routes =================================================
    // handle things like api calls
    // authentication routes
    app.get('/api/auth', function(req, res) {
        if(req.session.hasOwnProperty('authenticated')){
            res.json({authenticated: req.session.authenticated});
        } else {
            res.json({authenticated: false});
        }
    });

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

            if(pass.trim() == result.rows[0].hash.trim()) {
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

    // route to handle retrieving goes here (app.get)
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

    // route to handle creating goes here (app.post)
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

        // start query to db
        client.query("INSERT INTO mailingList(email) VALUES ('" + req.body.email + "');", function(err, result) {
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

    // route to handle delete goes here (app.delete)
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

    // frontend routes =================================================
    app.get('/pages/*', function(req, res, next) {
        res.render('.' + req.path);
    });
};
