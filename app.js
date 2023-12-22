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
const mainDashboardRoutes = require("./routes/main_dashboard/main_dashboard");
const registerRedirectRoutes = require("./routes/register/register_redirect");
const trainingFormRoutes = require("./routes/register/training_form");

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
    cookie: { maxAge: 30 * 60 * 1000 }, //30min (in milliseconds)   //Define how much time we want the session to stay open
  })
);

// Initialisation de Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Utilitaire de vérification de l'authentification
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
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
app.use("/", mainDashboardRoutes);
app.use("/", registerRedirectRoutes);
app.use("/", trainingFormRoutes);

// Routes
app.get("/", (req, res) => {
  console.log(req);

  if (req.session.views) {
    req.session.views++;
    res.setHeader("Content-Type", "text/html");
    res.write("<p>views: " + req.session.views + "</p>");
    res.end();
  } else {
    req.session.views = 1;
    res.end("welcome to the session demo. refresh!");
  }
});

app.get("/login", (req, res) => {
  res.render("login", { loginErrorMessage: "" });
});

app.get("/display", (req, res) => {
  res.render("display", { test: "" });
});

//Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server running on port: ${port}`);
});
