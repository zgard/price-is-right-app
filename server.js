const express = require('express')
const app = express();
const session = require('express-session');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./models');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(session({secret: 'abcdefg', resave: false, saveUninitialized: false}));

passport.use(new googleStrategy ({
    clientID: '432914722093-sr5934ubo3lqka8hcjur4jcn9432755p.apps.googleusercontent.com',
    clientSecret: 'C5RgTuf1rUnPe-JcRqmlaVLl',
    callbackURL: 'http://localhost:5000/auth/google/callback'
}, function(accessToken, refreshToken, profile, cb) {
    db.users.findOrCreate({ where: {email: profile.emails[0].value, userName: profile.displayName} }).then(user => {
        if (user) {
            return cb(null, user);
        }
    })
    console.log(profile);
    }
));

//make sure to always put the initialize before the passport.session
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


app.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile','email'] }));


app.get('/auth/google/callback', 
    passport.authenticate('google', {failureRedirect: '/login'}),
    function(req, res) {
        res.redirect('/');
});

app.get('/logout', function(req, res, next) {
    console.log('logging out');
    req.logout();
    res.redirect('/logged-out');
});

app.get('/login', (req, res, next) => {
    res.render('login');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function logRequest(req, res, next) {
    console.log('another request');
    next();
}

app.get('/dashboard', ensureAuthenticated, logRequest, (req, res, next) => {
    res.send('Dashboard bro');
})

app.get('/logged-out', (req, res, next) => {
    res.send('Logged Out');
});

app.get('/ping', (req, res, next) => {
    res.send('pong');
})

app.listen(5000, () => {
    console.log('Hello master');
});