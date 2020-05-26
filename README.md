# price-is-right-app

The Price is Right Game is a web app designed for users to guess the right price of a product shown in the GUI. 
The game was designed to give points for the right answers.

## Goal
To build a Game by utilizing backend development skills.

## Instructions
Once logged in, click on the start game button from your dashboard.  

An item picture, description, and 4 buttons with prices will be shown. The objective is to click on the button with the correct price. When you would like to finish, click on the End Game button.  

## Table of Contents:
 [Requirements]
 [Deployment]
 [APIs Used]
 [Dev Notes]
 [Authors]

## Requirements
* [Express](https://github.com/expressjs/express)
* [Express-flash](https://github.com/expressjs/flash)
* [PassportJS](https://github.com/jaredhanson/passport)
* [PostgreSQL](https://www.postgresql.org/)
* [Sequelize](https://github.com/sequelize/sequelize)
* [EJS](https://github.com/mde/ejs)
* [dotenv](https://github.com/motdotla/dotenv)
* [MethodOveride](https://github.com/expressjs/method-override)
* [Bcrypt](https://github.com/topics/bcrypt-nodejs)
* [Passport-Local](https://github.com/jaredhanson/passport-local)
<<<<<<< HEAD
=======
* [Lodash](https://github.com/lodash/lodash)
>>>>>>> ce9d81a8cc51ff4b121a624e669246024f0e13ec

## Deployment
* [Heroku](https://www.heroku.com/)

### APIs Used:
| API Name:             |Data retrieved from API:                                          |
|-----------------------|:----------------------------------------------------------------:|
| Wegman's              | Prices, product description, and product image                   |

### Dev Notes
.gitignore: used to exclude specific packages from being uploaded into github
Source JS/EJS files: 
    app.js - main javascript the starts the processes for the game
    passport-confil.js - required for passport local-strategy
    dahboard.ejs - Explains rules of game and will display the leader board once design is completed
    games.ejs - Upcoming in later version
    question.ejs - logic for how questions are displayed
    login.ejs - login form and authentication rules
    logout.ejs - logout form button with _methodOverrid to delete session
    register.ejs - registration form button. Required name, email and password
Bootstrap: <!--<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>-->

<!--<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>-->

<!--<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>-->

## Authors
 * [Lance Prewit](https://github.com/lfprewit)
 * [Nicholas Howland](https://github.com/nhowlandatl)
 * [Kelvin Lester](https://github.com/klester01)
 * [Zach Gardner](https://github.com/zgard)
 * [Shankar Pushparaj](https://github.com/Shankarp88)
