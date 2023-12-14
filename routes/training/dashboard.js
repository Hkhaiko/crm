const express = require("express");
const authController = require("../../controllers/user/auth");
const dashboardController = require("../../controllers/training/dashboard");

const multer = require("multer");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/import-excel",
  upload.single("excelFile"),
  dashboardController.importExcel
);

router.get(
  "/dashboard",
  authController.ensureAuthenticated,
  dashboardController.getTrainingDashboard
);

module.exports = router;
