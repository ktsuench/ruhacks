// .env loading ============================================
// development purposes only
const dotenv = require('dotenv');

if (!process.env.requireDotenv) {
  dotenv.config();
}

// modules =================================================
const express = require('express');

const app = express();

// configuration ===========================================

// set our port
app.set('port', (process.env.PORT || 7000));
// app.use('/2017', require('./2017/server'));
app.use('/', require('./2018/server'));

// start app ===============================================
app.listen(app.get('port'), () => {
  console.log('root: Node app is running on port', app.get('port'));
});

// expose app
module.exports = app;
