const express = require("express");
const router = express.Router();
const trainingFormController = require("../../controllers/register/training_form");
const authController = require("../../controllers/user/auth");

router.get(
  "/register-redirect/training",
  authController.ensureAuthenticatedAndAdmin,
  trainingFormController.getTrainingForm
);

router.post("/add-training-client", trainingFormController.addClient);

module.exports = router;
