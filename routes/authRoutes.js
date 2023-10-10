//authRoutes.js
const express = require('express');
const passport = require('passport');
const dashboardController = require('../controllers/dashboardController');


const router = express.Router();

// Route de connexion
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  }));

// Route d'inscription
router.post('/register', dashboardController.createUser);
  
// Route de déconnexion
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  
module.exports = router;