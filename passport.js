const passport =require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

// clientID: '196188452551-b7av2cfeptf3ecsqqodr70miuiogu604.apps.googleusercontent.com',
//         clientSecret: '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',
//         callbackURL: '/auth/google/callback'
passport.use(new GoogleStrategy({
        clientID:"196188452551-b7av2cfeptf3ecsqqodr70miuiogu604.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL: "/google/callback",
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
            return done(null, profile);
    }
));