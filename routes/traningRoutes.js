// Fichier traningRoutes.js dans le répertoire routes
const express = require('express');
const router = express.Router();
const traningController = require('../controllers/traningController');

router.post('/traning', traningController.createTraningUser);
router.delete('/traning/:traningId', traningController.deleteTraningUsers);
router.get('/traning', traningController.getTraningUsers);
router.put('/traning/:traningId', traningController.updatedTraningUserData);


module.exports = router;
