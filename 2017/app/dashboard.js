module.exports = function(app) {
  // handle login route
  app.get('/login', function(req, res){
    if (req.session.hasOwnProperty('authenticated') && req.session.authenticated){
      res.redirect('/2017/dash');
    } else {
      res.render('login');
    }
  });

  // handle dashboard landing page route
  app.get('/dash', function(req, res){
    checkAuthElseRender(req, res, 'pages/dash/index');
  });

  // handle dashbaord subscribers page route
  app.get('/dash/subscribers', function(req, res){
    checkAuthElseRender(req, res, 'pages/dash/subscribers');
  });

  // handle catch all dashboard check to see if user is logged in
  app.get('/dash/*', function(req, res){
    if (req.session.hasOwnProperty('authenticated') && req.session.authenticated){
      res.render('pages/dash');
    } else {
      res.redirect('/2017/login');
    }
  });
}

function checkAuthElseRender(req, res, pageToRender) {
  if (req.session.hasOwnProperty('authenticated') && req.session.authenticated){
    res.render(pageToRender);
  } else {
    res.redirect('/2017/login');
  }
}