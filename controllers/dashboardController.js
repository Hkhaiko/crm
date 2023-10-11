// controllers/dashboard.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

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
  

exports.createUser = (req, res) => {
    const updatedUserData = req.body;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

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
