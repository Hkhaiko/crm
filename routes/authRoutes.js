//authRoutes.js
const express = require('express');
const passport = require('passport');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

// Route de connexion
router.post('/login', dashboardController.checkLogin);

// Route d'inscription
router.post('/register', dashboardController.createUser);

// Route add new client to dashboard
router.post('/addClient', dashboardController.addClient);
  
// Route de déconnexion
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

module.exports = router;