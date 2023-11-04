const db = require("../config/db");

// Fonction pour créer un nouvel utilisateur
exports.createUser = (req, res) => {
  const userData = req.body; // Les données de l'utilisateur à partir du corps de la demande
  console.log(req.body);

  // Exécutez une requête SQL pour insérer l'utilisateur dans la base de données
  const sql = "INSERT INTO user (name, email,gender) VALUES (?, ?, ?)";
  const values = [userData.name, userData.email, userData.gender];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating user: " + err.message);
      res.status(500).send("Error creating user");
    } else {
      console.log("User created successfully");
      res.status(201).send("User created successfully");
    }
  });
};
