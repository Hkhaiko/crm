const db = require("../config/db");

exports.getCompanyUserById = (req, res) => {
  const sqlContact = `SELECT * FROM company_contact WHERE company_profile_id = ?`;
  const sqlProject = `SELECT * FROM completed_project WHERE company_profile_id = ?`;
  const sqlOpportunities = `SELECT * FROM company_opportunities WHERE company_profile_id = ?`;
  const sqlCompanyProfile = `SELECT * FROM company_profile WHERE company_profile_id = ?`;

  const values = req.params.id;
  let contactResults;
  let projectResults;
  let opportunitesResults;
  let comapanyProfileResults;

  // Utilisez Promises ou async/await pour gérer les requêtes de manière asynchrone
  Promise.all([
    new Promise((resolve, reject) => {
      db.query(sqlContact, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          contactResults = results;
          resolve(contactResults);
        }
      });
    }),
    new Promise((resolve, reject) => {
      db.query(sqlProject, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          projectResults = results;
          resolve(projectResults);
        }
      });
    }),
    new Promise((resolve, reject) => {
      db.query(sqlOpportunities, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          opportunitesResults = results;
          resolve(opportunitesResults);
        }
      });
    }),
    new Promise((resolve, reject) => {
      db.query(sqlCompanyProfile, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          comapanyProfileResults = results;
          resolve(comapanyProfileResults);
        }
      });
    }),
  ])
    .then(() => {
      // Une fois que toutes les requêtes sont terminées, vous pouvez appeler res.render
      const data = {
        contactResult: contactResults,
        projectCompany: projectResults,
        opportunitesResult: opportunitesResults,
        companyProfileResult: comapanyProfileResults,
      };
      console.log("CONSOLE DATA ");
      console.log(data);
      res.render("companyProfile", { data });
    })
    .catch((err) => {
      console.error(
        "Erreur lors de la lecture des utilisateurs : " + err.message
      );
      // Gérez l'erreur ici en fonction de votre besoin
    });
};

exports.deleteCompanyContact = (req, res) => {
  const company_profile_id = req.params.id;
  const company_contact_id = req.body.company_contact_id;
  const sqlDeleteContact =
    "DELETE FROM company_contact WHERE company_contact_id = ?";

  const values = company_contact_id;
  const redirectUrl = `/company-profile/${encodeURIComponent(
    company_profile_id
  )}`;
  console.log(company_contact_id);
  console.log(company_profile_id);
  console.log("test");
  db.query(sqlDeleteContact, values, (err, result) => {
    if (err) {
      console.error("Error deleting Traningser:" + err.message);
      res.status(500).send("Error deleting TraningUser");
    } else {
      console.log("User successfully deleted");
      res.redirect(redirectUrl);
    }
  });
};

exports.createContact = (req, res) => {
  const contactData = req.body;
  const company_id = req.params.id;
  console.log(contactData);

  const redirectUrl = `/company-profile/${encodeURIComponent(company_id)}`;
  const sql =
    "INSERT INTO company_contact (name, position, telephone, email, company_profile_id) VALUES (?, ?, ?, ?, ?)";
  const values = [
    contactData.name,
    contactData.position,
    contactData.telephone,
    contactData.email,
    company_id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("Error :" + err.message);
      res.status(500).send("Error creating contact");
    } else {
      console.log("Contact successfully created");
      console.log(result);
      res.redirect(redirectUrl);
    }
  });
};
