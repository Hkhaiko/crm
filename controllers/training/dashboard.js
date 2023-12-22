const db = require("../../config/db");
const readXlsxFile = require("read-excel-file/node");

exports.importExcel = (req, res) => {
  const sql = "SELECT * FROM training";

  if (!req.file) {
    return res.status(400).send("No file has been downloaded");
  }

  // Lecture du fichier Excel depuis la mémoire
  readXlsxFile(req.file.buffer)
    .then((rows) => {
      // Parcourez les lignes du fichier Excel et insérez-les dans la table "training"
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const excelData = {
          certificationCode: row[0],
          fullName: row[1],
          company: row[2],
          position: row[3],
          email: row[4],
          telephone: row[5],
          date: row[6],
          title: row[7],
          futureTopics: row[8],
        };

        // Exécutez une requête SQL d'insertion
        const sql =
          "INSERT INTO training (certificationCode, fullName, company, position, email, telephone, date, title, futureTopics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
          excelData.certificationCode,
          excelData.fullName,
          excelData.company,
          excelData.position,
          excelData.email,
          excelData.telephone,
          excelData.date,
          excelData.title,
          excelData.futureTopics,
        ];

        db.query(sql, values, (err, result) => {
          if (err) {
            console.error(
              "Erreur lors de l'insertion des données : " + err.message
            );
          } else {
            console.log(
              "Données insérées avec succès : " + JSON.stringify(excelData)
            );
          }
        });
      }

      db.query(sql, (err, results) => {
        if (err) {
          console.error(
            "Erreur lors de la récupération des données depuis la base de données:",
            err
          );
          // Gérez l'erreur ici, par exemple, redirigez l'utilisateur vers une page d'erreur
          res.render("error"); // Créez une vue error.ejs appropriée
        } else {
          const training = results; // Les données des personnes sont stockées dans results
          // Transmettez les données des personnes à votre modèle EJS pour le rendu
          res.render("dashboard", { training });
        }
      });
    })
    .catch((err) => {
      console.error(
        "Erreur lors de la lecture du fichier Excel : " + err.message
      );
      res.status(500).send("Erreur lors de l'importation des données.");
    });
};

exports.getTrainingDashboard = (req, res) => {
  // Effectuez une requête SQL pour récupérer les informations des personnes depuis votre base de données
  const sql = "SELECT * FROM training"; // Remplacez "personnes" par le nom de votre table

  db.query(sql, (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des données depuis la base de données:",
        err
      );
      // Gérez l'erreur ici, par exemple, redirigez l'utilisateur vers une page d'erreur
      res.render("error"); // Créez une vue error.ejs appropriée
    } else {
      const training = results;
      res.render("dashboard", { training });
    }
  });
};

exports.addClient = (req, res) => {
  const trainingClient = req.body;
  const sql =
    "INSERT INTO training (certificationCode, fullName, company, position, email, telephone, date, title, futureTopics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const data = [
    trainingClient.certificationCode,
    trainingClient.fullName,
    trainingClient.company,
    trainingClient.position,
    trainingClient.email,
    trainingClient.telephone,
    trainingClient.date,
    trainingClient.title,
    trainingClient.futureTopics,
  ];

  console.log(req.query);

  db.query(sql, data, (err, result) => {
    if (err) {
      console.log("Error :" + err.message);
      res.status(500).send("Error creating client");
    } else {
      res.redirect("/dashboard");
      console.log("Created client successfully");
    }
  });
};
