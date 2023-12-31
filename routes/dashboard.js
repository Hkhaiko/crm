const express = require("express");
const dashboardController = require("../controllers/dashboard");
const excelController = require("../controllers/dashboard");
const multer = require("multer");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/import-excel",
  upload.single("excelFile"),
  dashboardController.importExcel
);

module.exports = router;
