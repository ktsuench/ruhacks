var pg = require('pg');
var db = require('../config/db');
var crypto = require('crypto');

module.exports = function(app) {
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