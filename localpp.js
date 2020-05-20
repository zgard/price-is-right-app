if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config')//referencing the location where we initialize passport //initializing from passport-config
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)
const users = [];//storing locally instead of on the persist database to test logic. Replace with database

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: false })) //this allows for the fields (password/email) on the form page to be access inside the req variable inside the login POST method
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,//should we resave session variables if nothing changes? 
    saveUninitialized: false //should we save an empty value in the session if there is not value?
}))
app.use(passport.initialize())//function in passport that sets up some of the basics
app.use(passport.session())//store variables to be persistent accross the entire sessions
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
});
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}
))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
});
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10) //includes await since we are using async
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')//If everthing is correct, redirect user to login page to continue loggin in
    } catch {
        res.redirect('/register') //If not correct, send user back to register page
    }
    console.log(users)
    //req.body.password //corresponds to the "name" (name, email, password) on the form field
})
//Create logout function. This function is provided by passport. Envoked using methodOverride
//Install methodOverride library and require & use
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

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
        return res.redirect('/')
    }
    next()
}

app.listen(3000, () => {
    console.log('Listening on port 3000: ')
}
);