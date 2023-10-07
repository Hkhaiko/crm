const db = require('../config/db');

// Fonction pour créer un nouvel utilisateur
exports.createUser = (req, res) => {
    const traningData = req.body; // Les données de l'utilisateur à partir du corps de la demande
    const date = traningData.date;
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!date.match(dateRegex)) {
      // La date n'a pas le format correct, renvoyez une erreur
      return res.status(400).send('Le format de la date est incorrect (dd/mm/yyyy)');
    }

    // Exécutez une requête SQL pour insérer l'utilisateur dans la base de données
    const sql = 'INSERT INTO traning (certificationCode, fullname, company, position, email, telephone, date, title, futureTopics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [traningData.certificationCode, traningData.fullname, traningData.company, traningData.position, traningData.email, traningData.telephone, traningData.date, traningData.title, traningData.futureTopics];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error creating traning: ' + err.message);
        res.status(500).send('Error creating traning');
      } else {
        console.log('traning created successfully');
        res.status(201).send('traning created successfully');
      }
    });
};
