// Fichier traningController.js dans le répertoire controllers
const db = require("../config/db");

// Fonction pour créer un nouvel utilisateur
exports.createTraningUser = (req, res) => {
  const updatedUserData = req.body; // Les données de l'utilisateur à partir du corps de la demande
  const date = updatedUserData.date;
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

  const email = updatedUserData.email;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!email.match(emailRegex)) {
    // L'e-mail ne correspond pas au format attendu, renvoyez une erreur
    return res.status(400).send("email is wrong");
  }

  if (!date.match(dateRegex)) {
    // La date n'a pas le format correct, renvoyez une erreur
    return res
      .status(400)
      .send("Le format de la date est incorrect (dd/mm/yyyy)");
  }

  // Exécutez une requête SQL pour insérer l'utilisateur dans la base de données
  const sql =
    "INSERT INTO traning (certificationCode, fullname, company, position, email, telephone, date, title, futureTopics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    updatedUserData.certificationCode,
    updatedUserData.fullname,
    updatedUserData.company,
    updatedUserData.position,
    updatedUserData.email,
    updatedUserData.telephone,
    updatedUserData.date,
    updatedUserData.title,
    updatedUserData.futureTopics,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating traning: " + err.message);
      res.status(500).send("Error creating traning");
    } else {
      console.log("traning created successfully");
      res.status(201).send("traning created successfully");
    }
  });
};

exports.deleteTraningUsers = (req, res) => {
  const traningId = req.params.id;
  const sql = "DELETE FROM traning WHERE traning_id = ?";
  const values = [traningId];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error deleting Traningser:" + err.message);
      res.status(500).send("Error deleting TraningUser");
    } else {
      console.log("User successfully deleted");
      res.status(200).send("User successfully deleted");
    }
  });
};

exports.teste = (req, res) => {
  const traningId = req.params.traningId;
  const sql = "SELECT * FROM traning WHERE id = 12";
  const results = db.query(sql);
  console.log(db.query(sql, [traningId]));
  // Si la requête renvoie une erreur, renvoyez une erreur
  if (results.length === 0) {
    return null;
  }
  // Sinon, renvoyez les résultats
  return results[0];
};

exports.test = (req, res) => {
  // Exécutez une requête SQL pour sélectionner tous les utilisateurs de la base de données
  res.render("display", { test: "teaeaz" });
};

// Get All traningUsers
exports.getTraningUsers = (req, res) => {
  // Exécutez une requête SQL pour sélectionner tous les utilisateurs de la base de données
  const sql = "SELECT * FROM traning";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la lecture des utilisateurs : " + err.message
      );
      res.status(500).send("Erreur lors de la lecture des utilisateurs");
    } else {
      const traning = results;
      console.log(traning);
      console.log("Utilisateurs lus avec succès");
      res.status(200).json(results); // Renvoie les résultats au format JSON
      res.render("traningUser", { traning });
    }
  });
};

exports.updatedTraningUserData = (req, res) => {
  const traningId = req.params.id;
  const redirectUrl = `/traning-user/${encodeURIComponent(traningId)}`;

  const updatedUserData = req.body; // Les données mises à jour de l'utilisateur à partir du corps de la demande
  console.log(updatedUserData);
  // Exécutez une requête SQL pour mettre à jour l'utilisateur dans la base de données
  const sql =
    "UPDATE traning SET certificationCode = ?, fullName = ?, company = ?, position = ?, email = ?, telephone = ?, date = ?, title = ?, futureTopics = ? WHERE traning_id = ?";
  const values = [
    updatedUserData.certificationCode,
    updatedUserData.fullName,
    updatedUserData.company,
    updatedUserData.position,
    updatedUserData.email,
    updatedUserData.telephone,
    updatedUserData.date,
    updatedUserData.title,
    updatedUserData.futureTopics,
    traningId,
  ];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la mise à jour de l'utilisateur : " + err.message
      );
      res.status(500).send("Erreur lors de la mise à jour de l'utilisateur");
    } else {
      const traningUpdate = results;
      console.log(traningUpdate);
      console.log("Utilisateur mis à jour avec succès");
      res.redirect(redirectUrl);
    }
  });
};

exports.getTraningUserById = (req, res, next) => {
  const sqlCompany = `SELECT * FROM traning JOIN company_experience ON traning.traning_id = company_experience.traning_id WHERE traning.traning_id = ?`;
  const sqlFormation = `SELECT * FROM traning JOIN formation ON traning.traning_id = formation.traning_id WHERE traning.traning_id = ?`;
  const sqlTraning = `SELECT * FROM traning WHERE traning_id = ?`;
  const values = req.params.id;
  const redirectUrl = `/traning-user/${encodeURIComponent(values)}`;

  let traningResults;
  let companyResults;

  // Variable pour suivre si la réponse a déjà été rendue
  let responseRendered = false;

  db.query(sqlCompany, values, (err, results) => {
    if (err) {
      return next(err);
    }
    companyResults = results;
    // Quand Y a rien
    if (companyResults.length === 0) {
      db.query(sqlTraning, values, (err, results) => {
        if (err) {
          return next(err);
        }
        traningResults = results;

        console.log("ici first");
        console.log(traningResults);

        if (traningResults.length === 0) {
          return res.status(404).send("User not found");
        }

        // Rend la réponse si elle n'a pas encore été rendue
        if (!responseRendered) {
          const traning = traningResults;
          console.log("la");
          console.log(traning);
          res.render("traningUser", { traning });
          responseRendered = true;
        }
      });
    } else {
      // Quand Y a une carte
      // Rend la réponse si elle n'a pas encore été rendue
      if (!responseRendered) {
        const traning = companyResults;
        console.log(traning);

        res.render("traningUser", { traning });
        responseRendered = true;
      }
    }
  });
};
