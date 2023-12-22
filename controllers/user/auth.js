const db = require("../../config/db");
const passport = require("passport");
const bcrypt = require("bcrypt");

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login"); // Redirige l'utilisateur vers la page de connexion s'il n'est pas authentifié
};

const findById = (userId) => {
  const sql = `SELECT training_id from user where user_id = ?`;
  const value = userId;

  db.query(sql, value, (err, result) => {
    if (err) {
      console.error("Error password: " + err.message);
    } else {
      console.log(result);
      return result;
    }
  });
};

const sessionIdGenerator = () => {
  const length = 60;
  const possibleCharacters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let sessionId = "";

  for (let i = 0; i < length; i++) {
    sessionId += possibleCharacters.charAt(
      Math.floor(Math.random() * possibleCharacters.length)
    );
  }
  return sessionId;
};

exports.checkLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    const isAdmin = user.isAdmin;
    const user_id = user.user_id;
    console.log(user);
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
      if (isAdmin) {
        return res.redirect("/main-dashboard");
      }
      return res.redirect(`/training-user/${user.training_id}/experience`);
    });
  })(req, res, next);
};

//REGISTER
exports.createUser = (req, res) => {
  const updatedUserData = req.body;
  const password = req.body.password;
  const sessionId = sessionIdGenerator();
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      // Gérez l'erreur, par exemple, en renvoyant une réponse d'erreur
      return res.status(500).send("Erreur lors du hachage du mot de passe.");
    }
    //ICI ON VEUT le training_id de notre profile
    const sql = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
    const sqlCredentials =
      "INSERT INTO user_credentials_temp (email, password, session_id) VALUES (?, ?, ?)";

    const userData = [updatedUserData.name, updatedUserData.email, hash];
    const credentialsValue = [updatedUserData.email, hash, sessionId];

    if (!req.session.credentials) {
      req.session.credentials = {
        name: updatedUserData.name,
        email: updatedUserData.email,
        password: hash,
      };
    }

    console.log("======================AUTHHHHHHHHHH++++++++++++++==");
    console.log(req.session);
    db.query(sqlCredentials, credentialsValue, (err, result) => {
      if (err) {
        console.log("Error :", err);
      } else {
        console.log(" Credentials created successfully");
      }
    });

    req.session.save((err) => {
      // ICI je save mes credentials dans l'url /register-redirect
      if (err) return next(err);
      db.query(sql, userData, (err, result) => {
        if (err) {
          res.redirect("register-redirect");
        } else {
          console.log("Created successfully");
          res.status(201).redirect("/login");
        }
      });
    });
  });
};

exports.detectRole = (req, res) => {
  const sql = `SELECT email from user where user_id = ?`;
  const value = [];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error getting email: " + err.message);
    } else {
      console.log("email get successfully");
    }
  });

  determineUserRole(email)
    .then((isAdmin) => {
      // Utilisez la valeur isAdmin pour adapter le rendu ou la logique de votre page
      if (isAdmin) {
        res.render("admin-dashboard", { user: req.user });
      } else {
        res.render("client-dashboard", { user: req.user });
      }
    })
    .catch((error) => {
      console.error("Error determining user role:", error);
      res.status(500).send("Internal Server Error");
    });
};

exports.getTrainingId = (req, res) => {};

const determineUserRole = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT isAdmin FROM user WHERE email = ?";
    const value = [email];

    db.query(sql, value, (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          const isAdmin = results[0].isAdmin;
          console.log(isAdmin);
          resolve(isAdmin === 1);
        } else {
          reject("User not found");
        }
      }
    });
  });
};

exports.getRegister = (req, res) => {
  res.render("register");
};
