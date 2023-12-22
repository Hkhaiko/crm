const express = require("express");
const router = express.Router();
const trainingFormController = require("../../controllers/register/training_form");

router.get(
  "/register-redirect/training",
  trainingFormController.getTrainingForm
);

router.post("/add-training-client", trainingFormController.addClient);

module.exports = router;
