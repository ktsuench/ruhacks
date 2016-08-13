// place models here to build api

module.exports = function(app) {
    // route to handle all angular requests
    app.set('views', 'public/views');
    app.set('view engine', 'pug');

    app.all('/*', function(req, res, next) {
        var arbitraryUrls = ['pages', 'api'];
        
        if (arbitraryUrls.indexOf(req.url.split('/')[1]) > -1) {
            next();
        } else {
            res.render('landing');
        }
    });

    // server routes =================================================
    // handle things like api calls
    // authentication routes

    // route to handle retrieving goes here (app.get)
    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =================================================
    app.get('/pages/*', function(req, res, next) {
        res.render('.' + req.path);
    });
};
