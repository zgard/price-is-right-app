// this is setup for Heroku
// https://nuxtjs.org/faq/heroku-deployment/ for alternative branch deployment
// remove dotenv when running on heroku
require('dotenv').config();  
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

const apiKey = process.env.API_KEY;
// const apiKey = 'insert here'; for hard-coded


const axios = require('axios');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// working EJS function
app.get('/game', function(req, res) {
    // let randRecipe = {}; 
    axios
    .get(
        // 'https://api.spoonacular.com/recipes/findByNutrients?maxCalories=300&number=5&apiKey=yourAPiKey' hard-coded
        `'https://api.spoonacular.com/recipes/findByNutrients?maxCalories=300&number=5&apiKey=${apiKey}'`
    )
    .then(function (response) {
        // console.log(response) 
        const randRecipe = response;
        // console.log(randRecipe) 
        res.render('game', {recipeArray: randRecipe}); 
    });
});
   
app.listen('3000', function() {
    console.log('Listening on port 3000')
});

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


// // first attempt function
// // Render a recipe's calories for future game testing
// function renderCalories(randRecipe) {
//     // console.log(gameInfo); 
//     let calorieInfo = randRecipe.map(calories => {
//         // console.log(topGame); 
//         // console.log(topGame.game.box.medium) 
//         return`
//             <div class="card mx-2 my-5">
//                 <div class="card-body">
//                     <h5 id="gameName" class="card-title d-flex flex-column text-center">${topGame.game.name}</h5>
//                     <img class="img d-block w-100" src="${topGame.game.box.medium}" alt="...">
//                     <span id="gameViewers" class="date badge badge-dark">${topGame.viewers} current viewers</span> 
//                     <span id="gameViewers" class="date badge badge-dark">${topGame.channels} current streamers</span> 
//                 </div>
//             </div>
//         `
//     })
//     return renderInfo.join('');
// };

// // Bring in 5 recipes and save to array
// function getRecipe() {
//     let randRecipe = {};
//     axios
//     .get(
//         'https://api.spoonacular.com/recipes/findByNutrients?maxCalories=300&number=5&apiKey=ed320f4b389446a8bffffd4a53b1604c'
//     )
//     .then(function (response) {
//         randRecipe = renderGame(response);
//         // console.log(randRecipe); 
// })};

// getRecipe();  // this will later be a button you click to start the game 
// // iterate over the array and return the calorie count of 5 recipes
// function renderGame(recipeArray) {
//     let recipeInfo = recipeArray.data.map(recipe => {
//         return recipe.calories
//     })
//     console.log(recipeInfo);  
// }

// console.log(recipeInfo); 

// second attempt (works)
// app.get('/game', function(req, res) {
//     // Get 5 recipes
//     let randRecipe = {};
//     axios
//     .get(
//         'https://api.spoonacular.com/recipes/findByNutrients?maxCalories=300&number=5&apiKey=ed320f4b389446a8bffffd4a53b1604c'
//     )
//     .then(function (response) {
//         console.log(response)
//         randRecipe = renderGame(response);
//     });
//     // Iterate over the array and return the calorie count of the recipes
//     function renderGame(randRecipe) {
//         let recipeInfo = randRecipe.data.map(recipe => {
//             return`
//             <div class="card" style="width: 18rem">
//                 <div class="card-body">
//                     <h5 class="card-title d-flex flex-column text-center">${recipe.calories}</h5>
//                 </div>
//             </div>
//             `
//             // return recipe.calories 
//         })
//         // return recipeInfo.join('');
//         // console.log(recipeInfo);  
//         // res.render('game', {recipeInfo});
//     }
// });

