//authRoutes.js
const express = require("express");
const authController = require("../../controllers/user/auth");

const router = express.Router();

// Route de connexion
router.post("/login", authController.checkLogin);

// Route d'inscription
router.post("/register", authController.createUser);

// Route add new client to dashboard
router.post("/add-client", authController.addClient);

// Route de déconnexion
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
