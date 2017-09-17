module.exports = function (app) {
  // route set up
  app.set('views', '2018/public/views');
  app.set('view engine', 'pug');

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.all('/*', (req, res, next) => {
    const arbitraryUrls = ['2017'];

    if (arbitraryUrls.indexOf(req.url.split('/')[1]) > -1) {
      next();
    } else {
      res.render('index');
    }
  });
};
