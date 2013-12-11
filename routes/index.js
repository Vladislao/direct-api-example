var needle = require('needle');

// SPA
exports.index = function (req, res) {
    res.render('index', { authenticated: req.isAuthenticated() });
};

// Logout from current session
exports.logout = function(req, res){
    req.logout();
    res.redirect('/');
};

// old:         https://api.direct.yandex.ru/v4/json/
// new:         https://api.direct.yandex.ru/live/v4/json/
exports.proxy = function (req, res) {
    req.body.token = req.session.passport.user.accessToken;
    needle.post('https://api.direct.yandex.ru/live/v4/json/', JSON.stringify(req.body)).pipe(res);
};

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected. If
// the request is authenticated (typically via a persistent login session),
// the request will proceed. Otherwise, the user will be redirected to the
// login page.
exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}