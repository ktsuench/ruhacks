// .env loading ============================================
// development purposes only
if(!process.env.requireDotenv) require('dotenv').config();

// modules =================================================
var express         = require('express');
var app             = express();

// configuration ===========================================

// set our port
app.set('port', (process.env.PORT || 7700));
app.use('/2017', require('./2017/server'));

// start app ===============================================
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// expose app           
exports = module.exports = app;