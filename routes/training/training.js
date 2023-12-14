const express = require("express");
const router = express.Router();
const trainingController = require("../../controllers/training/training");
const authController = require("../../controllers/user/auth");

router.post("/training", trainingController.createTraningUser);
router.post("/delete-training/:id", trainingController.deleteTraningUsers);
router.get("/training-user", trainingController.getTraningUsers);
router.post(
  "/training-user-update/:id",
  trainingController.updatedTraningUserData
);
router.get(
  "/training-user/:id/experience",
  authController.ensureAuthenticated,
  trainingController.getTraningUserById
);
router.get(
  "/training-user/:id/formation",
  authController.ensureAuthenticated,
  trainingController.getTraningUserById
);

module.exports = router;
