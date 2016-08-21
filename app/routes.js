// place models here to build api
var pg = require('pg');
var db = require('../config/db');
var client = new pg.Client(db.url);

module.exports = function(app) {
    // route to handle all angular requests
    app.set('views', 'public/views');
    app.set('view engine', 'pug');

    app.all('/*', function(req, res, next) {
        var arbitraryUrls = ['pages', 'api'];
        
        if (arbitraryUrls.indexOf(req.url.split('/')[1]) > -1) {
            next();
        } else {
            res.render('index');
        }
    });

    // server routes =================================================
    // handle things like api calls
    // authentication routes

    // route to handle retrieving goes here (app.get)
    // route to handle creating goes here (app.post)
    app.post('/api/mailingList', function(req, res) {
        console.log(req.body);

        // connect to db
        client.connect(function(err) {
            if(err) throw err;            
        });

        // start query to db
        client.query("INSERT INTO mailingList(email) VALUES ('" + req.body.email + "')", function(err, result) {
            if(err) throw err;
            console.log(result.rows);

            // end connection to db
            client.end(function(err) {
                if(err) throw err;
            });
        });

        res.sendStatus(200);
    });
    // route to handle delete goes here (app.delete)

    // frontend routes =================================================
    app.get('/pages/*', function(req, res, next) {
        res.render('.' + req.path);
    });
};
