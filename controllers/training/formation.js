const db = require("../../config/db");
const multer = require("multer");

exports.addFormation = (req, res) => {
  const formationData = req.body;

  const redirectUrl = `/training-user/${encodeURIComponent(
    formationData.training_id
  )}/formation`;
  const sql =
    "INSERT INTO formation (title, trainer, start_date, end_date, training_id) VALUES (?, ?, ?, ?, ?)";
  const values = [
    formationData.standard,
    formationData.trainer,
    formationData.formation_start_date,
    formationData.formation_end_date,
    formationData.training_id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("Error :" + err.message);
      res.status(500).send("Error creating formation");
    } else {
      console.log("Formation successfully created");
      console.log(result);
      res.redirect(redirectUrl);
    }
  });
};

exports.deleteFormation = (req, res) => {
  const formationData = req.body;
  const redirectUrl = `/training-user/${encodeURIComponent(
    formationData.training_id
  )}/formation`;
  const sqlPdf = "DELETE FROM pdf WHERE formation_id = ?";
  const sql = "DELETE FROM formation WHERE formation_id = ?";
  const values = formationData.formation_id;

  db.query(sqlPdf, values, (err, result) => {
    if (err) {
      console.error("Error deleting company experience:" + err);
      res.status(500).send("Error deleting company experience");
    } else {
      console.log("Successfully deleted");
    }
  });
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error deleting company experience:" + err);
      res.status(500).send("Error deleting company experience");
    } else {
      console.log("Successfully deleted");
      res.redirect(redirectUrl);
    }
  });
};

exports.downloadFormationPDF = (req, res) => {
  const formationId = req.body.formation_id;
  console.log(formationId);

  const sql = `SELECT path FROM pdf WHERE formation_id = ?`;

  db.query(sql, formationId, (err, result) => {
    if (err) {
      console.error("Error downloading pdf:" + err.message);
      res.status(500).send("Error downloading pdf");
    } else {
      const pdfPath = result;
      if (pdfPath.length > 0) {
        console.log(pdfPath[pdfPath.length - 1].path);
        res.download(pdfPath[pdfPath.length - 1].path);
        console.log("Successfully download PDF");
      } else {
        console.log("We need to download");
        res.status(204).send();
      }
    }
  });
};

exports.importFormationPdf = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file has been downloaded");
  }

  const formationData = req.body;
  console.log(formationData.formation_id);

  if (formationData.formation_id != null) {
    const redirectUrl = `/training-user/${encodeURIComponent(
      formationData.training_id
    )}/formation`;
    const fileBuffer = req.file.buffer;

    const fs = require("fs");
    const filePath = "C:/xampp/htdocs/pdf/" + req.file.originalname;

    fs.writeFileSync(filePath, fileBuffer);

    const sql = "INSERT INTO pdf (path, formation_id) VALUES (?, ?)";

    const values = [filePath, formationData.formation_id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error importing pdf :" + err.message);
        res.status(500).send("Error importing pdf");
      } else {
        console.log("Successfully imported");
        res.redirect(redirectUrl);
      }
    });
  } else {
    console.log("There is no formation");
  }
};
