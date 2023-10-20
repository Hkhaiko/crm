// Fichier traningRoutes.js dans le répertoire routes
const express = require('express');
const router = express.Router();
const traningController = require('../controllers/traning');

router.post('/traning', traningController.createTraningUser);
router.delete('/traning/:id', traningController.deleteTraningUsers);
router.get('/traning-user', traningController.getTraningUsers);
router.post('/traning-user/:id', traningController.updatedTraningUserData); //HERE
router.get('/display/:id', traningController.test);
router.get('/traning-user/:id', traningController.getTraningUserById);

router.post('/test/:id', traningController.updatedTraningUserData); //HERE

module.exports = router;
