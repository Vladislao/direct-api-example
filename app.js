/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var path = require('path');
var passport = require('passport');
var YandexStrategy = require('passport-yandex').Strategy;
var config = require('./config.js');

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing. However, since this example does not
// have a database of user records, the complete Yandex profile is
// serialized and deserialized.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});


// Use the YandexStrategy within Passport.
// Strategies in Passport require a `verify` function, which accept
// credentials (in this case, an accessToken, refreshToken, and Yandex
// profile), and invoke a callback with a user object.
passport.use(new YandexStrategy({
        clientID: config.YANDEX_CLIENT_ID,
        clientSecret: config.YANDEX_CLIENT_SECRET,
        callbackURL: "http://direct-api-example.herokuapp.com/auth/yandex/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        // To keep the example simple, the user's Yandex profile is returned
        // to represent the logged-in user. In a typical application, you would
        // want to associate the Yandex account with a user record in your
        // database, and return that user instead.
        return done(null, { profile: profile, accessToken: accessToken, refreshToken: refreshToken });
    }
));

var app = express();
// all environments
app.configure(function () {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.session({secret: config.AWESOME_SECRET}));
    // Initialize Passport! Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

// development only
app.configure('development', function () {
    app.use(express.errorHandler());
});

// production only
app.configure('production', function () {
});

app.get('/', routes.index);

app.post('/api/', routes.ensureAuthenticated, routes.proxy);

// GET /auth/yandex
// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in Yandex authentication will involve
// redirecting the user to yandex,ru. After authorization, Yandex
// will redirect the user back to this application at /auth/yandex/callback
app.get('/auth/yandex',
    passport.authenticate('yandex'),
    function (req, res) {
        // The request will be redirected to Yandex for authentication, so this
        // function will not be called.
    });

// GET /auth/yandex/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
app.get('/auth/yandex/callback',
    passport.authenticate('yandex', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/');
    });

app.get('/auth/logout', routes.logout);

app.listen(config.PORT, function () {
    console.log('Express server listening on port ' + config.PORT);
});
