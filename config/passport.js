// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Configuration de la stratégie locale
passport.use(new LocalStrategy(
  (username, password, done) => {
    // Code de vérification des informations d'identification ici
  }
));

module.exports = passport;
