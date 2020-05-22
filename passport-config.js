const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if (user == null) {
            return done(null//use null since error is not on server side, 
                , false//return user found, 
                , { message: 'No User with that email' })
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }

        } catch (e) { //error within application
            return done(e)

        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' },
        authenticateUser)) //by default the usernameField is username but we are
    //using email so we need to enter email in this object.

    passport.serializeUser((user, done) => done(null, user.id))//serialize user to store inside session
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}
module.exports = initialize
