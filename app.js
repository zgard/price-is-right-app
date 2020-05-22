// this is setup for Heroku
// https://nuxtjs.org/faq/heroku-deployment/ for alternative branch deployment
// remove dotenv when running on heroku
require('dotenv').config();  
// const apiKey = process.env.API_KEY;
// const apiKey = 'insert here'; for hard-coded api key

const { Sequelize } = require('sequelize'); 

// this works when running on heroku, but not locally
// const sequelize = new Sequelize(process.env.DATABASE_URL); 

// use this code when running locally
// also you will need to run 'sudo apt-get install -y libpq-dev' and 'npm install pg-native'
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

app.use(bodyParser.urlencoded({ extended: false })) // parse application/json
app.use(bodyParser.json())

app.set('view engine', 'ejs');
app.set('views', 'views');

// working EJS function to create array of recipes
// app.get('/game', function(req, res) {
//     axios
//     .get(
//         // 'https://api.spoonacular.com/recipes/findByNutrients?maxCalories=300&number=5&apiKey=yourAPiKey' hard-coded
//         `https://api.spoonacular.com/recipes/findByNutrients?maxCalories=300&number=5&apiKey=${apiKey}`
//     )
//     .then(function (response) {
//         // console.log(response) 
//         const randRecipe = response;
//         // console.log(randRecipe) 
//         res.render('game', {recipeArray: randRecipe}); 
//     });
// });
   
// Old route to fetch a random product
// app.get('/products/', (req, res) => {
// 	getProductWithWagman()
// 		.then((product) => {
// 			if (!product) {
// 				return res.redirect('/products');
// 			}
// 			// run the math function below to create random prices
// 			const prices = createRandomPrices(product.pricing.price);
// 			res.render('game', { product, prices });
//     });
// });

app.get('/products', (req, res) => {
    getProductWithWagman().then((product) => {
        if (!product) {
            return res.redirect('/products');
		}
        res.render('game', { product });
    });
});

let numCorrect = 0;
let numIncorrect = 0;
let totalAnswered = 0;
let userAverage = 0;
// let userAnswer = null; 

app.post('/answer/', (req, res) => {
	// req should contain chosen answer. 
	var answer = req.body.answer
	var correctPrice = req.body.correctPrice
	console.log('your answer is: ' + answer)
	console.log('the correct price: ' + correctPrice);
	if(answer == correctPrice) {
		numCorrect++
		console.log('your total correct: ' + numCorrect)
		console.log('you hit the correct answer!')
	}
	// if(userAnswer) {
	// 	numCorrect++
	// 	console.log(numCorrect)
	// 	console.log("you hit the correct answer!")
	// } 
	else {
		numIncorrect++
		console.log('your total incorrect: ' + numIncorrect)
		console.log("you hit the incorrect answer!")
	}
	res.redirect('/products')
});

app.post('/completed/', (req, res) => {
	totalAnswered = numCorrect + numIncorrect;
	console.log('you answered ' + totalAnswered + ' in total');
	console.log('you got ' + numCorrect + ' correct')
	userAverage = numCorrect / totalAnswered;
	console.log('your average was ' + userAverage);
	var completed = req.body.endGame
	if (completed == req.body.endGame) {
		db.users.findOrCreate({
			// see comments below
			where:
				{
					userName: 'user3', // this needs to come from passport, like a passport ID/username?
					email: 'teddy2', // not sure we need this if we can bring in some identifier from passport
					totalCorrect: numCorrect,
					totalWrong: numIncorrect,
					average: userAverage
				}
			})
			.spread(function(scoreLogged, created) {
				console.log(scoreLogged.get({
					plain: true
				}))
				if (created) {
					console.log('Scores were added to database')
				} else {
					console.log('This entry was already made')
				}
			})
	}
});

function randomInteger(array) {
	return Math.floor(Math.random() * array.length);
};

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
			console.log(product.details.tradeIdentifiers[0].images); 
			// check to  see if product has an image in wegman API. If not, render a kitty in its place.
			if (product.details.tradeIdentifiers[0].images.length === 0)
			 	{
				// change the array to this placeholder image if blank
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

function createRandomPrices(product) {
	const price1 = product.pricing.price;
	const price2 = _.round(price1 - .2, [precision=2]);
	const price3 = _.round(price1 + 1, [precision=2]);
	const price4 = _.round(price1 + 2, [precision=2]);
	const pricesSet = [price1, price2, price3, price4];
	_.shuffle(pricesSet); // why isn't this lodash function working? need to get this working
	// console.log(pricesSet);
	return pricesSet;
};

app.listen('3000', function() {
    console.log('Listening on port 3000')
});

// Database code

// Readline
// const readline = require('readline');
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// // Connect to database object
const db = require('./models') 
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// // Models and tables
db.users = require('./models/users.js')(sequelize, Sequelize); 

module.exports = db; 

// // Test prompt user for parameters
// rl.question('user name? ', (usernameInput) => {
//     rl.question('please enter email ', (emailInput) => {
//         rl.question('please enter total correct ', (userCorrect) => {
//             rl.question('please enter total wrong ', (userWrong) => {
//                 rl.question('please enter average ', (userAvg) => {
//                     rl.close();
//                 // create the user
//                 db.users.findOrCreate({
//                     where:
//                         {
//                         userName: usernameInput,
//                         email: emailInput,
//                         totalCorrect: userCorrect,
//                         totalWrong: userWrong,
//                         average: userAvg
//                         }
//                     })
//                     .spread(function(userAdded, created) {
//                         console.log(userAdded.get({
//                             plain: true
//                         }))
//                         if (created) {
//                             console.log('New user was added to database')
//                         } else {
//                             console.log('User already exists')
//                         }
//                     })
//                 })
//             })
//         })
//     })
// });

// // listen for requests
// db.sequelize.sync().then(function() {
//     http.createServer(app).listen(app.get('port'), function(){
//       console.log('Express server listening on port ' + app.get('port'));
//     });
//   });


// old function (no longer used)
// function getProductWithWagman() {
// 	const key = '&Subscription-key=c455d00cb0f64e238a5282d75921f27e';
// 	const url = 'https://api.wegmans.io';
// 	const categories = ['steak', 'milk', 'bread', 'fruits', 'soup', 'pasta'];
// 	let sku = null;
// 	const category = categories[randomInteger(categories)];
// 	return axios
// 		.get(
// 			`${url}/products/search?query=${category}&api-version=2018-10-18${key}`
// 		)
// 		.then((results) => {
// 			sku = results.data.results[randomInteger(results.data.results)].sku;
// 			if (sku)
// 				return Promise.all([
// 					axios.get(
// 						`${url}/products/${sku}/prices/68?api-version=2018-10-18${key}`
// 					),
// 					axios.get(`${url}/products/${sku}?api-version=2018-10-18${key}`),
// 				]);
// 		})
// 		.then((results) => {
// 			const product = {
// 				sku,
// 				pricing: results[0].data,
//                 details: results[1].data,
// 			};
// 			return product; 
// 		})
// 		.catch((e) => console.error(e));
// };

// Alex's random math function (no longer used)
// function createRandomPrices(price) { 
// 	// return [1, 2, 3, 4]; this works
// 	const min = price - price * 0.2;
// 	const max = price + price * 0.2;
// 	const pricesArray = (
// 		[
// 			price,
// 			randomInteger(max, min, price),
// 			randomInteger(max, min, price),
// 			randomInteger(max, min, price),
// 		].sort(() => Math.random() - 0.5)
// 	);
// 	// console.log(pricesSet); 
// 	if (pricesSet.size < 4) {
// 		return createRandomPrices(price);
// 	}
// 	return Array.from(pricesSet);
// };

// }function randomInteger(max, min, price) {
// 	const cents = price.toString().split('.')[1];
// 	const randomNumber =
// 		Math.floor(Math.random() * (max - min) + min) + '.' + cents;
// 	if (randomNumber !== price) {
// 		return parseFloat(randomNumber);
// 	}
// 	return randomInteger(max, min, price);
// }
// }const prices = createRandomPrices(productPrice);