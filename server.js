if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
};

const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./models');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');//referencing the location where we initialize passport //initializing from passport-config
initializePassport(
    passport,
    // db.users.findOrCreate({ where: {email: users.email} }).then(user => {
    //     if (user) {
    //         return cb(null, user);
    //     }
    // }),
    // db.users.findOrCreate({ where: { id: users.id} }).then(user => {
    //     if (user) {
    //         return cb(null, user);
    //     }
    // })
    
    email => db.users.findOne({ where: {email: email} }),
    id => db.users.findByPk(id)

    // email => users.find(user => user.email === email),
    // id => users.find(user => user.id === id)
    );

//need to change route for local from login to auth/local

const users = [];

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: false })); //this allows for the fields (password/email) on the form page to be access inside the req variable inside the login POST method
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET, //We need to ask about this
    resave: false,//should we resave session variables if nothing changes? 
    saveUninitialized: false //should we save an empty value in the session if there is not value?
}));
app.use(methodOverride('_method'));

app.use(session({secret: 'abcdefg', resave: false, saveUninitialized: false}));

//make sure to always put the initialize before the passport.session
app.use(passport.initialize());
app.use(passport.session());

passport.use(new googleStrategy ({
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRETID,
    callbackURL: 'http://localhost:5000/auth/google/callback'
}, function(accessToken, refreshToken, profile, done) {
    db.users.findOrCreate({ where: {email: profile.emails[0].value, userName: profile.displayName} }).then(user => {
        if (user) {
            return done(null, user[0]);
        }
    })
    console.log(profile);
    }
));

//Check to authenticate if a user is logged in. If not, redirects user to login page
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}
//Make sure no uers dont go back to the login page if they are already authenticated
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard')
    }
    next()
}

function logRequest(req, res, next) {
    console.log('another request');
    next();
};

app.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile','email'] }))

app.get('/auth/google/callback', 
    passport.authenticate('google', {failureRedirect: '/login'}),
    function(req, res) {
        console.log("whatever");
        res.redirect('/login');
});

// app.get('/logout', function(req, res, next) {
//     console.log('logging out');
//     req.logout();
//     res.redirect('/logged-out');
// });

// app.get('/', checkAuthenticated, (req, res) => {
//     res.render('login.ejs', { name: req.user.name })
// });

// app.get('/login', (req, res, next) => {
//     res.render('login');
// });
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
});
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}
))


app.get('/dashboard', checkAuthenticated, logRequest, (req, res, next) => {
    res.send('Dashboard bro');
})

app.get('/logged-out', (req, res, next) => {
    res.send('Logged Out');
});

app.get('/ping', (req, res, next) => {
    res.send('pong');
});

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
});
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10) //includes await since we are using async
        db.users.create({
            userName: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        .then(newUser => {
        console.log(`New user ${newUser.userName}, with id ${newUser.id} has been created.`);
        });
        res.redirect('/login')//If everthing is correct, redirect user to login page to continue loggin in
    } catch {
        res.redirect('/register') //If not correct, send user back to register page
    }
    console.log(users)
    //req.body.password //corresponds to the "name" (name, email, password) on the form field
});
//Create logout function. This function is provided by passport. Envoked using methodOverride
//Install methodOverride library and require & use
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})


app.listen(5000, () => {
    console.log('Hello master');
})