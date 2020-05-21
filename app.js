// this is setup for Heroku
// https://nuxtjs.org/faq/heroku-deployment/ for alternative branch deployment
// remove dotenv when running on heroku
// require('dotenv').config();  
// const apiKey = process.env.API_KEY;
// const apiKey = 'insert here'; for hard-coded api key

// const { Sequelize } = require('sequelize'); 

// this works when running on heroku, but not locally
// const sequelize = new Sequelize(process.env.DATABASE_URL); 

// use this code when running locally
// also you will need to run 'sudo apt-get install -y libpq-dev' and 'npm install pg-native'
// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//     dialect: 'postgres',
//     protocol: 'postgres',
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false
//         }
//     }
// });

const _ = require('lodash');
const axios = require('axios');
const express = require('express');
const app = express();

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
   
// Route to fetch a random product
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

app.get('/products/', (req, res) => {
    getProductWithWagman().then((product) => {
        if (!product) {
            return res.redirect('/products');
        }
        res.render('game', { product });
    });
});

function randomInteger(array) {
	return Math.floor(Math.random() * array.length);
};

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
			return product;
		})
		.then((product) => {
			product['prices'].push(createRandomPrices(product));
			return product;
		})
		.catch((e) => console.error(e));
}

function createRandomPrices(product) {
	const price1 = product.pricing.price;
	const price2 = _.round(price1 - .2, [precision=2]);
	const price3 = _.round(price1 + 1, [precision=2]);
	const price4 = _.round(price1 + 2, [precision=2]);
	const pricesSet = [price1, price2, price3, price4];
	_.shuffle(pricesSet);
	return pricesSet;
};

// Alex's function
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

app.listen('3000', function() {
    console.log('Listening on port 3000')
});


// Databse code
// Readline
// const readline = require('readline');
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// Connect to database object
// const db = require('./models') 
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// Models and tables
// db.users = require('./models/users.js')(sequelize, Sequelize); 

// module.exports = db; 

// Test prompt user for parameters
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
// })

// listen for requests
// db.sequelize.sync().then(function() {
//     http.createServer(app).listen(app.get('port'), function(){
//       console.log('Express server listening on port ' + app.get('port'));
//     });
//   });