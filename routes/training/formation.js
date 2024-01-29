const express = require("express");
const formationController = require("../../controllers/training/formation");
const multer = require("multer");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/add-formation", formationController.addFormation);

router.post("/delete-formation", formationController.deleteFormation);

router.post(
  "/download-formation-pdf",
  formationController.downloadFormationPDF
);

router.post(
  "/import-certificate-pdf",
  upload.single("pdfFile"),
  formationController.importFormationPdf
);

module.exports = router;
