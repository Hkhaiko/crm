// Fichier trainingRoutes.js dans le répertoire routes
const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/training");

router.post("/training", trainingController.createTraningUser);
router.post("/delete-training/:id", trainingController.deleteTraningUsers);
router.get("/training-user", trainingController.getTraningUsers);
router.post(
  "/training-user-update/:id",
  trainingController.updatedTraningUserData
);
router.get("/training-user/:id", trainingController.getTraningUserById);

router.post("/test/:id", trainingController.updatedTraningUserData);

module.exports = router;
