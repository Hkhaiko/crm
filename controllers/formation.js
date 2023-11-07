const db = require("../config/db");

exports.addFormation = (req, res) => {
  const formationData = req.body;
  console.log("ici");
  console.log(formationData);
  console.log(formationData.training_id);

  const redirectUrl = `/training-user/${encodeURIComponent(
    formationData.training_id
  )}`;
  const sql =
    "INSERT INTO formation (title, trainer, start_date, end_date, training_id) VALUES (?, ?, ?, ?, ?)";
  const values = [
    formationData.title,
    formationData.trainer,
    formationData.formation_start_date,
    formationData.formation_end_date,
    formationData.training_id,
  ];
  console.log(formationData.training_id);

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
  )}`;
  const sql = "DELETE FROM formation WHERE formation_id = ?";
  const values = formationData.formation_id;
  console.log("Delete formation controllers");
  console.log(formationData.formation_id);
  console.log(values);
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error deleting company experience:" + err.message);
      res.status(500).send("Error deleting company experience");
    } else {
      console.log("Successfully deleted");
      res.redirect(redirectUrl);
    }
  });
};
