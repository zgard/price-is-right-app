// this is for a heroku DB connection
// if using heroku, make sure DATABASE_URL is in quotes

module.exports = {
    "development": {
        "dialectOptions": {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        
        "use_env_variable": "DATABASE_URL",
        "dialect": "postgres"
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "use_env_variable": "DATABASE_URL",
        "dialect": "postgres"
    }
};

