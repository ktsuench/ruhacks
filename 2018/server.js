// .env loading ============================================
// development purposes only
if(!process.env.REQUIRE_DOT_ENV) require('dotenv').config({path: "./2018/.env"});

// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var crypto = require('crypto');

// configuration ===========================================

// config files
var db = require('./config/db');

// set our port
app.set('port', (process.env.PORT_2018 || 7000));

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse cookies
var key = process.env.COOKIE_SECRET_2018 || "@\\Ks\\\"+#s}XA$c5@6PqJK-,7S+X5t^v^X&$[";
// refer to the express-session docs: https://github.com/expressjs/session
app.use(session(
  {
    path: '/',
    name: 'ruhacks-2018',
    secret: key,
    httpOnly: true,
    secure: false,
    maxAge: null,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/'
    }
  }
));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes ==================================================
require('./app/routes')(app); // configure our routes

// start app ===============================================
app.listen(app.get('port'), function() {
  console.log('2018: Node app is running on port', app.get('port'));
});

// expose app
exports = module.exports = app;