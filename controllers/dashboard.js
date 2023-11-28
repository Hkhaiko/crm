const db = require("../config/db");
const bcrypt = require("bcrypt");
const passport = require("passport");
const readXlsxFile = require("read-excel-file/node");

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
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      const errorMessage = "Invalid email or password";
      return res.render("login", { loginErrorMessage: errorMessage });
    }
    req.logIn(user, (err) => {
      if (err) {
        //L'erreur est ICI !!
        console.log("login error");
        return next(err);
      }
      return res.redirect("/dashboard");
    });
  })(req, res, next);
};

exports.addClient = (req, res) => {
  const trainingClient = req.body;
  const sql =
    "INSERT INTO training (certificationCode, fullName, company, position, email, telephone, date, title, futureTopics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const excelData = [
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

  db.query(sql, excelData, (err, result) => {
    if (err) {
      console.log("Error :" + err.message);
      res.status(500).send("Error creating client");
    } else {
      res.redirect("/dashboard");
      console.log(result);
      console.log("Created client successfully");
    }
  });
};

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

exports.createUser = (req, res) => {
  const updatedUserData = req.body;
  const password = req.body.password;

  // Hachez le mot de passe avant de l'enregistrer dans la base de données
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      // Gérez l'erreur, par exemple, en renvoyant une réponse d'erreur
      return res.status(500).send("Erreur lors du hachage du mot de passe.");
    }
    // À ce stade, "hash" contient le mot de passe haché
    // Enregistrez le nom d'utilisateur et le mot de passe haché dans la base de données
    const sql = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
    const excelData = [updatedUserData.name, updatedUserData.email, hash];

    db.query(sql, excelData, (err, result) => {
      if (err) {
        console.error("Error password: " + err.message);
        res.status(500).send("Error password");
      } else {
        console.log("Created successfully");
        res.status(201).redirect("/login");
      }
    });
  });
};
