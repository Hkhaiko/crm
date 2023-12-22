//authRoutes.js
const express = require("express");
const authController = require("../../controllers/user/auth");

const router = express.Router();

// Route de connexion
router.post("/login", authController.checkLogin);

// Route d'inscription
router.post("/register", authController.createUser);

// Route de déconnexion
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/register", authController.getRegister);

module.exports = router;
