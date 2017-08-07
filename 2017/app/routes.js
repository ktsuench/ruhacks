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
    var arbitraryUrls = ['pages', 'api', 'login', 'dash', 'mailingList'];

    if (arbitraryUrls.indexOf(req.url.split('/')[1]) > -1) {
      next();
    } else {
      res.render('index');
    }
  });

  // server routes =================================================
  require('./api')(app);
  require('./dashboard')(app);
  require('./mailingList')(app);

  // frontend routes =================================================
  app.get('/pages/*', function(req, res, next) {
    res.render('.' + req.path);
  });
};