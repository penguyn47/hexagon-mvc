const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const userService = require('../apps/users/user.service');
const userController = require('../apps/users/user.controller');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'username'}, (username, password, done) => {
            userService.getUserByUsername(username)
            .then(user => {
                if(!user) {
                    return done(null, false, {message: 'Username and password is not matched!'});
                }
                
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch){
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Username and password is not matched!'});
                    }
                });
            })
            .catch(err => console.log(err));
        })
    );

    // passport.serializeUser((user, done) => {
    //     done(null, user.id);
    // });

    passport.serializeUser(function(user, done) {
        process.nextTick(function() {
          return done(null, {
            id: user.id,
            username: user.username,
            picture: user.url
          });
        });
    });

    // passport.deserializeUser((id, done) => {
    //     userController.getUserById(id, (err, user) => {
    //         done(err, user);
    //     })
    // });

    passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
          return cb(null, user);
        });
      });
}