const express = require("express");
const db = require("./config/db");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const userRoutes = require("./routes/user/user");
const trainingRoutes = require("./routes/training/training");
const authRoutes = require("./routes/user/auth");
const dashboardRoutes = require("./routes/training/dashboard");
const companyExperienceRoutes = require("./routes/training/company_experience");
const formationRoutes = require("./routes/training/formation");
const comapanyProfileRoutes = require("./routes/company/company");

const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Configuration de la session
app.use(
  session({
    secret: "MaCleSecreteSuperSecurisee1234", // Remplacez par une clé secrète réelle
    saveUninitialized: true,
    resave: false,
  })
);

// Initialisation de Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Utilitaire de vérification de l'authentification
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Champ de formulaire pour l'adresse e-mail
      passwordField: "password", // Champ de formulaire pour le mot de passe
    },
    (email, password, done) => {
      // Recherchez l'utilisateur correspondant à l'adresse e-mail dans la base de données
      const sql = "SELECT * FROM user WHERE email = ?";
      db.query(sql, [email], (err, results) => {
        if (err) {
          return done(err);
        }

        if (results.length === 0) {
          // Aucun utilisateur trouvé avec cette adresse e-mail
          return done(null, false, { message: "Email is not correct" });
        }

        const user = results[0];

        // Vérifiez si le mot de passe correspond
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return done(err);
          }

          if (!isMatch) {
            // Le mot de passe ne correspond pas
            return done(null, false, { message: "Password is not correct" });
          }

          // Authentification réussie
          return done(null, user);
        });
      });
    }
  )
);

// Sérialisation de l'utilisateur dans la session
passport.serializeUser((user, done) => {
  // user est l'objet utilisateur que vous souhaitez stocker dans la session
  done(null, user.user_id); // Stockez l'ID de l'utilisateur dans la session
});

// Désérialisation de l'utilisateur depuis la session
passport.deserializeUser((id, done) => {
  // Recherchez l'utilisateur dans la base de données en utilisant l'ID stocké dans la session
  const sql = "SELECT * FROM user WHERE user_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      return done(err);
    }
    if (results.length === 0) {
      return done(null, false); // Aucun utilisateur trouvé avec cet ID
    }
    const user = results[0];
    done(null, user); // Renvoyez l'utilisateur trouvé
  });
});

// Configuration du moteur de templates EJS
app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));
// Routes pour les API
app.use("/", trainingRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", dashboardRoutes);
app.use("/", companyExperienceRoutes);
app.use("/", formationRoutes);
app.use("/", comapanyProfileRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to your CRM Mix Application !");
});

app.get("/login", (req, res) => {
  res.render("login", { loginErrorMessage: "" });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/display", (req, res) => {
  res.render("display", { test: "" });
});

//Training

app.get("/training-user/:id", (req, res) => {
  // Effectuez une requête SQL pour récupérer les informations des personnes depuis votre base de données
  const sql = "SELECT * FROM company_experience";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des données depuis la base de données:",
        err
      );
      // Gérez l'erreur ici, par exemple, redirigez l'utilisateur vers une page d'erreur
      res.render("error"); // Créez une vue error.ejs appropriée
    } else {
      const companyExperience = results; // Les données des personnes sont stockées dans results
      // Transmettez les données des personnes à votre modèle EJS pour le rendu
      res.render("training_user", { companyExperience });
    }
  });
});

app.get("/dashboard", (req, res) => {
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
});

//Company Dashboard

app.get("/company-dashboard", (req, res) => {
  const sql = "SELECT * FROM company_profile";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des données depuis la base de données:",
        err
      );
      res.render("error"); // Créez une vue error.ejs appropriée
    } else {
      const companyProfile = results;
      console.log(companyProfile);
      res.render("company_dashboard", { companyProfile });
    }
  });
});

app.get("/company-profile/:id", (req, res) => {
  res.render("company_profile");
});

app.get("/main-dashboard/", (req, res) => {
  res.render("main_dashboard");
});

//Server

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server running on port: ${port}`);
});
