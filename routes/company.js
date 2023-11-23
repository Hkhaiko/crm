const express = require("express");
const companyController = require("../controllers/company");

const router = express.Router();

router.get("/company-profile/:id", companyController.getCompanyUserById);
router.post(
  "/delete-company-contact/:id",
  companyController.deleteCompanyContact
);

router.post("/add-company-contact/:id", companyController.createContact);

module.exports = router;
