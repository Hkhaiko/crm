const express = require("express");
const formationController = require("../controllers/formation");

const router = express.Router();

router.post("/add-formation", formationController.addFormation);

router.post("/delete-formation", formationController.deleteFormation);

module.exports = router;
