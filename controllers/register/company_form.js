const db = require("../../config/db");

exports.getCompanyForm = (req, res) => {
  res.render("redirect_company_form");
};

exports.addCompany = (req, res) => {
  const companyData = req.body;
  const sql = "INSERT INTO company_profile (name) VALUES (?)";
  const sqlUserCreation = `INSERT INTO user (name, email, password, training_id, isAdmin) VALUES (?, ?, ?, ?, ?)`;
  const data = [companyData.name];
  const credentialsUser = req.session.credentials;

  const redirect_url = `/company-dashboard`;

  db.query(sql, data, (err, result) => {
    if (err) {
      console.log("Error :" + err.message);
      res.status(500).send("Error creating client");
    } else {
      console.log("Created client successfully");
    }
  });

  const userValues = [
    credentialsUser.name,
    credentialsUser.email,
    credentialsUser.password,
    null,
    "0",
  ];

  console.log("userValue : ", userValues);

  db.query(sqlUserCreation, userValues, (err, result) => {
    if (err) {
      console.log("Error :" + err.message);
      res.status(500).send("Error creating client");
    } else {
      console.log("Created client successfully");
      console.log(result);
      res.redirect(redirect_url);
    }
  });
};
