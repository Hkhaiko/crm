const express = require('express');
const router = express.Router();
const traningController = require('../controllers/traningController');

router.post('/traning', traningController.createUser);


module.exports = router;
