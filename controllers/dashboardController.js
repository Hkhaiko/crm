// controllers/dashboard.js
const db = require('../config/db');
const bcrypt = require('bcrypt');
const passport = require('passport');

// const isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.redirect('/login');
//   };

// // Utilisation de la fonction `isAuthenticated` pour protéger une route
// router.get('/protected', isAuthenticated, (req, res) => {
//   res.send('Ceci est la page protégée du tableau de bord.');
// });

exports.checkLogin = (req, res, next) => {
  console.log(req.body)
  passport.authenticate('local', (err, user, info) => {
      if (err) {
          return next(err);
      }
      if (!user) {
          return res.render('login');
      }
      req.logIn(user, (err) => {  
          if (err) {
              return next(err);
          }
          return res.redirect('/dashboard');
      });
  })(req, res, next);
};

exports.addClient = (req, res) => {
  const traningClient = req.body;
  const sql = 'INSERT INTO traning (certificationCode, fullName, company, position, email, telephone, date, title, futureTopics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [traningClient.certificationCode, traningClient.fullame, traningClient.company, traningClient.position, traningClient.email, traningClient.telephone, traningClient.date, traningClient.title, traningClient.futureTopics];

  console.log(req.body);
  db.query(sql, values, (err, result) =>{
    if (err){
      console.log("Error :" + err.message);
      res.status(500).send('Error creating client');
    } else{
      res.redirect('/dashboard')
      console.log('Created client successfully');
    }
  })
}


exports.createUser = (req, res) => {
    const updatedUserData = req.body;
    const password = req.body.password;

    // Hachez le mot de passe avant de l'enregistrer dans la base de données
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            // Gérez l'erreur, par exemple, en renvoyant une réponse d'erreur
            return res.status(500).send('Erreur lors du hachage du mot de passe.');
        }
        // À ce stade, "hash" contient le mot de passe haché
        // Enregistrez le nom d'utilisateur et le mot de passe haché dans la base de données
        const sql = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
        const values = [updatedUserData.name, updatedUserData.email, hash];

        db.query(sql, values, (err, result) => {
          if (err) {
            console.error('Error password: ' + err.message);
            res.status(500).send('Error password');
          } else {
            console.log('Created successfully');
            res.status(201).redirect('/login')
          }
        });
    });
};
