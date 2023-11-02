// Fichier traningRoutes.js dans le répertoire routes
const express = require('express');
const router = express.Router();
const traningController = require('../controllers/traning');

router.post('/traning', traningController.createTraningUser);
router.post('/delete-traning/:id', traningController.deleteTraningUsers);
router.get('/traning-user', traningController.getTraningUsers);
router.post('/traning-user-update/:id', traningController.updatedTraningUserData); // NOM DE ROUTE CHANGER LE 31/10
router.get('/display/:id', traningController.test);
router.get('/traning-user/:id', traningController.getTraningUserById);

router.post('/test/:id', traningController.updatedTraningUserData); 

module.exports = router;
