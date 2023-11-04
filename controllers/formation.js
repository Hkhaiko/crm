const db = require("../config/db");

exports.addFormation = (req, res) => {
  const formationData = req.body;
  console.log("ici");
  console.log(formationData);
  console.log(formationData.traning_id);

  const redirectUrl = `/traning-user/${encodeURIComponent(
    formationData.traning_id
  )}`;
  const sql =
    "INSERT INTO formation (title, trainer, start_date, end_date, traning_id) VALUES (?, ?, ?, ?, ?)";
  const values = [
    formationData.company_name,
    formationData.job_title,
    formationData.start_date,
    formationData.end_date,
    formationData.traning_id,
  ];
  console.log(formationData.traning_id);

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
