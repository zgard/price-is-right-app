// This is setup for Heroku
// https://nuxtjs.org/faq/heroku-deployment/ for alternative branch deployment
// Remove dotenv when running on heroku
require('dotenv').config();  
const apiKey = process.env.API_KEY;
// const apiKey = 'insert here'; for hard-coded api key

// const { Sequelize } = require('sequelize'); 
// const apiKey = process.env.API_KEY;

// Make sure sequelize is initialized above the new Seuquelize object below
const { Sequelize } = require('sequelize'); 

// This works when running on heroku, but not locally
// const sequelize = new Sequelize(process.env.DATABASE_URL); 

// Use this code when running locally
// You may need to run 'sudo apt-get install -y libpq-dev' and 'npm install pg-native'
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const bodyParser = require('body-parser');
const _ = require('lodash');
const axios = require('axios');
const express = require('express');
const app = express();

// Zach's passport code
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
};

const session = require('express-session');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config'); //referencing the location where we initialize passport //initializing from passport-config
initializePassport(
    passport,
    email => db.users.findOne({ where: {email: email} }),
    id => db.users.findByPk(id)
    );

// Need to change route for local from login to auth/local

app.use(express.urlencoded({ extended: false })); // This allows for the fields (password/email) on the form page to be access inside the req variable inside the login POST method
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET, // We need to ask about this
    resave: false,// Should we resave session variables if nothing changes? 
    saveUninitialized: false // Should we save an empty value in the session if there is not value?
}));
app.use(methodOverride('_method'));

// Make sure to always put the initialize before the passport.session
app.use(passport.initialize());
app.use(passport.session());

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRETID,
    callbackURL: 'http://localhost:5000/auth/google/callback'
	}, 
	function(accessToken, refreshToken, profile, done) 
	{
		// userEmail = profile.emails[0].value; 
    	db.users.findOrCreate({ 
			where: {
					email: profile.emails[0].value, 
					userName: profile.displayName
					} 
		}).then(user => {
        	if (user) {
            	return done(null, user[0]);
        	}
		})
	}
));
// Check to authenticate if a user is logged in. If not, redirects user to login page
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}
// Make sure no uers dont go back to the login page if they are already authenticated
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
	passport.authenticate('google', { scope: ['profile','email'] })
	)

app.get('/auth/google/callback', 
    passport.authenticate('google', {failureRedirect: '/login'}),
    function(req, res) {
		console.log("whatever");
        res.redirect('/login');
    });

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
});

// app.get('/user', function(req, res, next) {
// 	res.send(req.user.email);
// })

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
	},
))

app.get('/dashboard', checkAuthenticated, logRequest, (req, res, next) => {
    res.render('dashboard');
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs', {error: null})
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
        res.redirect('/login')//If everthing is correct, redirect user to login page to continue loggin in
        }).catch(e => {
            res.render('register', {error: 'This email already has a user account.'})
        })
    } catch {
        res.redirect('/register') //If not correct, send user back to register page
    }
    // console.log(users) 
    //req.body.password //corresponds to the "name" (name, email, password) on the form field
});
// Create logout function. This function is provided by passport. Envoked using methodOverride
// Install methodOverride library and require & use

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

// Connect to sequelize database object
const db = require('./models') 
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Sequelize models and tables
db.users = require('./models/users.js')(sequelize, Sequelize); 
module.exports = db; 

// Body parser for responses
app.use(bodyParser.urlencoded({ extended: false })) // parse application/json
app.use(bodyParser.json())

// EJS view files
app.set('view engine', 'ejs');
app.set('views', 'views');

// Express route where game is played and JSON info is fetched from Wegman API
app.get('/products', (req, res) => {
    getProductWithWagman().then((product) => {
        if (!product) {
			console.log("redirected");
			return res.redirect('/products');
			
		}
        res.render('game', { product });
    });
});

// Globals for use with express answer logging in below route
let numCorrect = 0;
let numIncorrect = 0;
let totalAnswered = 0;
let userAverage = 0;
// Let userAnswer = null; don't think we need a truse/false condition for answers

app.post('/answer/', (req, res) => {
	console.log(req.user)
	var answer = req.body.answer
	var correctPrice = req.body.correctPrice
	console.log('your answer is: ' + answer)
	console.log('the correct price: ' + correctPrice);
	if(answer == correctPrice) {
		numCorrect++
		console.log('your total correct: ' + numCorrect)
		console.log('you hit the correct answer!')
	}
	else {
		numIncorrect++
		console.log('your total incorrect: ' + numIncorrect)
		console.log("you hit the incorrect answer!")

	}
	res.redirect('/products')
});

// Route after user clicks end game button in game.ejs; tally up scores, average, and post to database
app.post('/completed/', (req, res) => {
	totalAnswered = numCorrect + numIncorrect;
	console.log('you answered ' + totalAnswered + ' in total');
	console.log('you got ' + numCorrect + ' correct')
	userAverage = numCorrect / totalAnswered;
	console.log('your average was ' + userAverage);
	var completed = req.body.endGame
	if (completed) {
		// attempt 1 to get user average score w/ db function
		// async(() => {
		// 	return await(users.findAll({
		// 		attributes: ['totalCorrect', 'totalWrong' [sequelize.fn('AVG', 
		// 		models.sequelize.col('rating')), 'ratingAvg']],
		// })
		// attempt 2 using raw query.
		sequelize.query('SELECT ((SUM(totalCorrect) + SUM(totalWrong)) / (COUNT(totalCorrect) + COUNT(totalWrong))) as average FROM users WHERE email = ?', {
			replacements: [req.user.email],
			model: db.users,
		})
		// Basically I need to process this query:
		// SELECT ((SUM(totalCorrect) + SUM(totalWrong)) / (COUNT(totalCorrect) + COUNT(totalWrong))) as average
		// FROM users
		// WHERE email=req.user.email;
		// currently working function, but the overall user average is not being updated after each game
		db.users.update({totalCorrect: numCorrect, totalWrong: numIncorrect, average: userAverage}, {
				where: {
					email:req.user.email
				}
			})
			// need to fix this so it works with new update function
			// .spread(function(scoreLogged, updated) {
			// 	console.log(scoreLogged.get({
			// 		plain: true
			// 	}))
			// 	if (updated) {
			// 		console.log('Scores were added to database')
			// 	} else {
			// 		console.log('This entry was already made')
			// 	}
			// })
			.then(res.redirect('/dashboard')) // Redirect to the dashboard where it displays the user stats.
	}
});

// This function is used below to randomize values
function randomInteger(array) {
	return Math.floor(Math.random() * array.length);
};

// Main API function; returns JSON of product info then randomizes it/shuffles. 
function getProductWithWagman() {
	const key = '&Subscription-key=c455d00cb0f64e238a5282d75921f27e';
	const url = 'https://api.wegmans.io';
	const categories = ['steak', 'milk', 'bread', 'fruits', 'soup', 'pasta'];
	let sku = null;
	const category = categories[randomInteger(categories)];
	return axios
		.get(
			`${url}/products/search?query=${category}&api-version=2018-10-18${key}`
		)
		.then((results) => {
			sku = results.data.results[randomInteger(results.data.results)].sku;
			if (sku)
				return Promise.all([
					axios.get(
						`${url}/products/${sku}/prices/68?api-version=2018-10-18${key}`
					),
					axios.get(`${url}/products/${sku}?api-version=2018-10-18${key}`),
				]);
		})
		.then((results) => {
			const product = {
				sku,
				pricing: results[0].data,
				details: results[1].data,
				prices: []
			};
			// Check to  see if product has an image in wegman API. If not, render a kitty in its place.
			if (product.details.tradeIdentifiers[0].images.length === 0)
			 	{
				// Change the array to this placeholder image if blank
				product.details.tradeIdentifiers[0].images[0] ='https://cdn.mos.cms.futurecdn.net/VSy6kJDNq2pSXsCzb6cvYF-650-80.jpg'
				}
			return product;
		})
		.then((product) => {
			product['prices'].push(createRandomPrices(product));
			return product;
		})
		.catch((e) => console.error(e));
};

// Randomize prices retrieved in above function; create shuffled array to send to game.ejs
function createRandomPrices(product) {
	const price1 = product.pricing.price;
	const price2 = _.round(price1 - .2, [precision=2]);
	const price3 = _.round(price1 + 1, [precision=2]);
	const price4 = _.round(price1 + 2, [precision=2]);
	const pricesSet = [price1, price2, price3, price4];
	// Shuffle the array
	var shuffledPrices = _.shuffle(pricesSet);
	return shuffledPrices;
};

// Hosting on port 5000
app.listen('5000', function() {
    console.log('Listening on port 5000')
});