// this is setup for Heroku
// https://nuxtjs.org/faq/heroku-deployment/ for alternative branch deployment

// remove dotenv when running on heroku
require('dotenv').config();
const apiKey = process.env.API_KEY;
// const apiKey = 'insert here'; for hard-coded api key

// const { Sequelize } = require('sequelize'); 
// const apiKey = process.env.API_KEY;

// make sure sequelize is initialized above the new Seuquelize object below
const { Sequelize } = require('sequelize');


// this works when running on heroku, but not locally
// const sequelize = new Sequelize(process.env.DATABASE_URL); 

// Use this code when running locally
// also you may need to run 'sudo apt-get install -y libpq-dev' and 'npm install pg-native'
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
	var answer = req.body.answer
	var correctPrice = req.body.correctPrice
	console.log('your answer is: ' + answer)
	console.log('the correct price: ' + correctPrice);
	if (answer == correctPrice) {
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
		db.users.findOrCreate({
			// see comments below
			where:
			{
				// userName: 'user3', // this needs to come from passport, like a passport ID/username?
				// email: 'teddy2', // not sure we need this if we can bring in some identifier from passport
				totalCorrect: numCorrect,
				totalWrong: numIncorrect,
				average: userAverage
			}
		})
			.spread(function (scoreLogged, created) {
				console.log(scoreLogged.get({
					plain: true
				}))
				if (created) {
					console.log('Scores were added to database')
				} else {
					console.log('This entry was already made')
				}
			})
			.then(res.redirect('/products')) // this should redirect to the dashboard where it displays the user stats.
	}
});

// this function is used below to randomize values
function randomInteger(array) {
	return Math.floor(Math.random() * array.length);
};

// main API function; returns JSON of product info then randomizes it/shuffles. 
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
			// check to  see if product has an image in wegman API. If not, render a kitty in its place.
			if (product.details.tradeIdentifiers[0].images.length === 0) {
				// change the array to this placeholder image if blank
				product.details.tradeIdentifiers[0].images[0] = 'https://cdn.mos.cms.futurecdn.net/VSy6kJDNq2pSXsCzb6cvYF-650-80.jpg'
			}
			return product;
		})
		.then((product) => {
			product['prices'].push(createRandomPrices(product));
			return product;
		})
		.catch((e) => console.error(e));
};

// randomize prices retrieved in above function; create shuffled array to send to game.ejs
function createRandomPrices(product) {
	const price1 = product.pricing.price;
	const price2 = _.round(price1 - .2, [precision = 2]);
	const price3 = _.round(price1 + 1, [precision = 2]);
	const price4 = _.round(price1 + 2, [precision = 2]);
	const pricesSet = [price1, price2, price3, price4];
	// shuffle the array
	var shuffledPrices = _.shuffle(pricesSet);
	return shuffledPrices;
};

// Hosting on port 3000
app.listen('3000', function () {
	console.log('Listening on port 3000')
});
