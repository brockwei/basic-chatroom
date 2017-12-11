//passport.js
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
  
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        //callbackURL: "http://188.166.180.145:8080/auth/facebook/callback",
        //callbackURL: "http://128.1.63.56:8080/auth/facebook/callback",
        //callbackURL: "http://localhost:8080/auth/facebook/callback",
        profileFields: ['email','name']
      },
      function(accessToken, refreshToken, profile, cb) {
        return cb(null,{profile:profile,accessToken:accessToken});
      }
    ));
    
    passport.serializeUser((user,done)=>{
      done(null,user);
    });
  
    passport.deserializeUser((user,done)=>{
      done(null,user);
    });
};
