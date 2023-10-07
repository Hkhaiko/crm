const express = require('express');
const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const traningRoutes = require('./routes/traningRoutes');

const app = express();
app.use(express.json());


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Express sever running in port : ${port}`);
  });

app.get('/', (req, res) => {
    res.send('Welcom to your CRM Mix Application');
  });

//=================================

app.use('/api', userRoutes);
app.use('/api', traningRoutes);




// ============== Route ============

//Create Users

// app.post('/users', (req, res) => {
//     const userData = req.body; // Les données de l'utilisateur à partir du corps de la demande
//     console.log(req.body);
  
//     // Exécutez une requête SQL pour insérer l'utilisateur dans la base de données
//     const sql = 'INSERT INTO user (name, email,gender) VALUES (?, ?, ?)';
//     const values = [userData.name, userData.email, userData.gender];
  
//     db.query(sql, values, (err, result) => {
//       if (err) {
//         console.error('Error creating user: ' + err.message);
//         res.status(500).send('Error creating user');
//       } else {
//         console.log('User created successfully');
//         res.status(201).send('User created successfully');
//       }
//     });
//   });
  
// Route DELETE pour supprimer un utilisateur par son ID
app.delete('/users/:userId', (req, res) => {
    const userId = req.params.userId;
  
    const sql = 'DELETE FROM user WHERE userId = ?';
    const values = [userId];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error deleting user:' + err.message);
        res.status(500).send('Error deleting user');
      } else {
        console.log('User successfully deleted');
        res.status(200).send('User successfully deleted');
      }
    });
  });


// Route GET pour lire les utilisateurs
app.get('/users', (req, res) => {
    // Exécutez une requête SQL pour sélectionner tous les utilisateurs de la base de données
    const sql = 'SELECT * FROM user';
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Erreur lors de la lecture des utilisateurs : ' + err.message);
        res.status(500).send('Erreur lors de la lecture des utilisateurs');
      } else {
        console.log('Utilisateurs lus avec succès');
        res.status(200).json(results); // Renvoie les résultats au format JSON
      }
    });
  });

// Route PUT pour mettre à jour un utilisateur par son ID
app.put('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    const updatedUserData = req.body; // Les données mises à jour de l'utilisateur à partir du corps de la demande
  
    // Exécutez une requête SQL pour mettre à jour l'utilisateur dans la base de données
    const sql = 'UPDATE user SET name = ?, email = ?, gender = ? WHERE userId = ?';
    const values = [updatedUserData.name, updatedUserData.email, updatedUserData.gender, userId];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur : ' + err.message);
        res.status(500).send('Erreur lors de la mise à jour de l\'utilisateur');
      } else {
        console.log('Utilisateur mis à jour avec succès');
        res.status(200).send('Utilisateur mis à jour avec succès');
      }
    });
  });


  