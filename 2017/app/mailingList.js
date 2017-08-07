var pg = require('pg');
var db = require('../config/db');
var Readable = require("stream").Readable;

module.exports = function(app) {
  // return all subscribers of mailing list
  app.get('/api/mailingList', function(req, res) {
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

        res.json(result.rows);

        // end connection to db
        client.end(function(err) {
          if (err) throw err;
        });
      });
    } else {
      res.redirect('/2017');
    }
  });

  // add new subscriber to mailing list
  app.post('/api/mailingList', function(req, res) {
    res.sendStatus(400);
  });

  // delete a subscriber from mailing list
  app.delete('/api/mailingList', function(req, res) {
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

        // end connection to db
        client.end(function(err) {
          if(err) throw err;
        });
      });

      res.sendStatus(200);
    } else {
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
      res.redirect('/2017');
    }
  });
}