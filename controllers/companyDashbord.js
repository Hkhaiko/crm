// controllers/dashboard.js
const db = require("../config/db");

exports.addClient = (req, res) => {
  const trainingClient = req.body;
  const sql =
    "INSERT INTO training (certificationCode, fullName, company, position, email, telephone, date, title, futureTopics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const excelData = [
    trainingClient.certificationCode,
    trainingClient.fullName,
    trainingClient.company,
    trainingClient.position,
    trainingClient.email,
    trainingClient.telephone,
    trainingClient.date,
    trainingClient.title,
    trainingClient.futureTopics,
  ];

  db.query(sql, excelData, (err, result) => {
    if (err) {
      console.log("Error :" + err.message);
      res.status(500).send("Error creating client");
    } else {
      res.redirect("/dashboard");
      console.log(result);
      console.log("Created client successfully");
    }
  });
};
