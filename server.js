// modules =================================================
var express         = require('express');
var app             = express();
var pg              = require('pg');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');

// configuration ===========================================

// config files
var db = require('./config/db');

// set our port
app.set('port', (process.env.PORT || 7000));

// connect to our postgres database 
var client = new pg.Client(db.url);

client.connect(function(err) {
    if(err) throw err;
});

// create mailingList table if it does not exist
client.query('CREATE TABLE IF NOT EXISTS mailingList (id SERIAL PRIMARY KEY NOT NULL, email CHAR(100) NOT NULL);', function(err, result){
    if(err) throw err;

    console.log(result);

    client.end(function(err) {
        if(err) throw err;
    });
});

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes ==================================================
require('./app/routes')(app); // configure our routes

// start app ===============================================
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// expose app           
exports = module.exports = app;