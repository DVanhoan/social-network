const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID:     "469093331292-4dd1sac7cg3l5q9t6mtn79vbpdaqum2f.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/login/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));