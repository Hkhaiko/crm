const express = require('express');
const db = require('./config/db');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const userRoutes = require('./routes/userRoutes');
const traningRoutes = require('./routes/traningRoutes');
const authRoutes = require('./routes/authRoutes');
const flash = require('connect-flash');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuration de la session
app.use(session({
  secret: 'secret', // Remplacez par une clé secrète réelle
  resave: false,
  saveUninitialized: true,
}));

app.use(flash());

// Initialisation de Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Utilitaire de vérification de l'authentification
passport.use(new LocalStrategy(
  {
    usernameField: 'email', // Champ de formulaire pour l'adresse e-mail
    passwordField: 'password', // Champ de formulaire pour le mot de passe
  },
  (req,email, password, done) => {
    // Recherchez l'utilisateur correspondant à l'adresse e-mail dans la base de données
    const sql = 'SELECT * FROM user WHERE email = ?';
    db.query(sql, [email], (err, results) => {
      if (err) {
        return done(err);
      }

      if (results.length === 0) {
        // Aucun utilisateur trouvé avec cette adresse e-mail
        return done(null, false, req.flash('error', 'Email is not correct'));
      }

      const user = results[0];

      // Vérifiez si le mot de passe correspond
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return done(err);
        }

        if (!isMatch) {
          // Le mot de passe ne correspond pas
          return done(null, false, req.flash('error', 'Password is not correct'));
        }

        // Authentification réussie
        return done(null, user);
      });
    });
  }
));

// Sérialisation de l'utilisateur dans la session
passport.serializeUser((user, done) => {
  // user est l'objet utilisateur que vous souhaitez stocker dans la session
  done(null, user.userId); // Stockez l'ID de l'utilisateur dans la session
});

// Désérialisation de l'utilisateur depuis la session
passport.deserializeUser((id, done) => {
  // Recherchez l'utilisateur dans la base de données en utilisant l'ID stocké dans la session
  const sql = 'SELECT * FROM user WHERE userId = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      return done(err);
    }
    if (results.length === 0) {
      return done(null, false); // Aucun utilisateur trouvé avec cet ID
    }
    const user = results[0];
    done(null, user); // Renvoyez l'utilisateur trouvé
  });
});

// Configuration du moteur de templates EJS
app.set('view engine', 'ejs');

// Servez les fichiers statiques depuis le dossier 'public'
app.use('/public', express.static(__dirname + '/public'));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to your CRM Mix Application');
});

app.get('/login', (req, res) => {
  res.render('login'); // 'login' est le nom de votre fichier HTML (sans l'extension)
});

app.get('/register', (req, res) => {
  res.render('register'); // Utilisez le nom du fichier EJS sans l'extension
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

// Routes pour les API
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', traningRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server running on port: ${port}`);
});