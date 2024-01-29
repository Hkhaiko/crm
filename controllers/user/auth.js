const db = require("../../config/db");
const passport = require("passport");
const bcrypt = require("bcrypt");

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    const user_id = req.params.id;

    if (isNaN(user_id)) {
      // Gérer le cas où user_id n'est pas un nombre
      return res.status(404).send("Page not found"); // A changer avec une page perso
    }

    if (user_id == req.user.training_id) {
      console.log("t'es bon la !");
      return next();
    } else {
      return res.status(404).send("Page not found");
    }
  }
  return res.redirect("/login"); // Redirige l'utilisateur vers la page de connexion s'il n'est pas authentifié
};

exports.ensureAuthenticatedAndAdmin = (req, res, next) => {
  const user_id = req.params.id;

  if (!req.isAuthenticated()) {
    return res.redirect("/login"); // Redirige l'utilisateur vers la page de connexion s'il n'est pas authentifié
  }

  const isAdminStatus = req.user.isAdmin;
  if (isAdminStatus === 0) {
    if (user_id == req.user.training_id) {
      console.log("test intérieur: ", user_id);
      console.log("t'es bon la !");
      return next();
    }
    // A changer avec une page perso
  } else {
    console.log("you are admin"); // Log pour confirmer l'accès admin
  }

  return next();
};

//LOGIN
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
      } else {
        if (user.training_id != null) {
          console.log("company"); //modifie ici
        }
        return res.redirect(`/training-user/${user.training_id}/experience`);
      }
    });
  })(req, res, next);
};

//REGISTER
exports.createUser = (req, res) => {
  const updatedUserData = req.body;
  const password = req.body.password;
  console.log(password);
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      // Gérez l'erreur, par exemple, en renvoyant une réponse d'erreur
      return res.status(500).send("Erreur lors du hachage du mot de passe.");
    }

    if (!req.session.credentials) {
      req.session.credentials = {
        name: updatedUserData.name,
        email: updatedUserData.email,
        password: hash,
      };
    }

    req.session.save((err) => {
      // ICI je save mes credentials dans l'url /register-redirect
      if (err) return next(err);
      res.redirect("register-redirect");
    });
  });
};

exports.logout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Erreur de déconnexion");
    } else {
      req.session = null; // Détruire la session
      res.redirect("/login"); // Redirection vers la page de déconnexion réussie
    }
  });
};

// exports.detectRole = (req, res) => {
//   const sql = `SELECT email from user where user_id = ?`;
//   const value = [];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error("Error getting email: " + err.message);
//     } else {
//       console.log("email get successfully");
//     }
//   });

//   determineUserRole(email)
//     .then((isAdmin) => {
//       // Utilisez la valeur isAdmin pour adapter le rendu ou la logique de votre page
//       if (isAdmin) {
//         res.render("admin-dashboard", { user: req.user });
//       } else {
//         res.render("client-dashboard", { user: req.user });
//       }
//     })
//     .catch((error) => {
//       console.error("Error determining user role:", error);
//       res.status(500).send("Internal Server Error");
//     });
// };

// const determineUserRole = (email) => {
//   return new Promise((resolve, reject) => {
//     const sql = "SELECT isAdmin FROM user WHERE email = ?";
//     const value = [email];

//     db.query(sql, value, (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         if (results.length > 0) {
//           const isAdmin = results[0].isAdmin;
//           console.log(isAdmin);
//           resolve(isAdmin === 1);
//         } else {
//           reject("User not found");
//         }
//       }
//     });
//   });
// };

exports.getRegister = (req, res) => {
  res.render("register");
};
