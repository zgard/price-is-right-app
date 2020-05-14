// this is setup for Heroku
// https://nuxtjs.org/faq/heroku-deployment/ for alternative branch deployment
// remove dotenv when running on heroku
// require('dotenv').config();  
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

// Readline
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Connect to database object
const db = require('./models')
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models and tables
db.users = require('./models/users.js')(sequelize, Sequelize);

module.exports = db;

// Test prompt user for parameters
rl.question('user name? ', (usernameInput) => {
    rl.question('please enter email ', (emailInput) => {
        rl.question('please enter total correct ', (userCorrect) => {
            rl.question('please enter total wrong ', (userWrong) => {
                rl.question('please enter average ', (userAvg) => {
                    rl.close();
                // create the user
                db.users.findOrCreate({
                    where:
                        {
                        userName: usernameInput,
                        email: emailInput,
                        totalCorrect: userCorrect,
                        totalWrong: userWrong,
                        average: userAvg
                        }
                    })
                    .spread(function(userAdded, created) {
                        console.log(userAdded.get({
                            plain: true
                        }))
                        if (created) {
                            console.log('New user was added to database')
                        } else {
                            console.log('User already exists')
                        }
                    })
                })
            })
        })
    })
})

// listen for requests
// db.sequelize.sync().then(function() {
//     http.createServer(app).listen(app.get('port'), function(){
//       console.log('Express server listening on port ' + app.get('port'));
//     });
//   });