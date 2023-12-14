const passport = require("passport");
const bcrypt = require("bcrypt");

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login"); // Redirige l'utilisateur vers la page de connexion s'il n'est pas authentifié
};

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
        console.log("login error");
        return next(err);
      }
      return res.redirect("/main-dashboard");
    });
  })(req, res, next);
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
