const db = require("../../config/db");

//Get main page

const extractTypeFromUrl = (url) => {
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];
  return lastPart;
};

exports.getCompanyUserById = (req, res) => {
  const sqlContact = `SELECT * FROM company_contact WHERE company_profile_id = ?`;
  const sqlProject = `SELECT * FROM company_project WHERE company_profile_id = ?`;
  const sqlOpportunities = `SELECT * FROM company_opportunities WHERE company_profile_id = ?`;
  const sqlCompanyProfile = `SELECT * FROM company_profile WHERE company_profile_id = ?`;
  const values = req.params.id;

  let contactResults;
  let projectResults;
  let opportunitesResults;
  let companyProfileResults;

  const contentTypeResults = extractTypeFromUrl(req.url);
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
          companyProfileResults = results;
          resolve(companyProfileResults);
        }
      });
    }),
  ])
    .then(() => {
      // Une fois que toutes les requêtes sont terminées, vous pouvez appeler res.render
      const data = {
        contactResult: contactResults,
        projectResult: projectResults,
        opportunitesResult: opportunitesResults,
        companyProfileResult: companyProfileResults,
        contentTypeResult: contentTypeResults,
      };
      console.log("CONSOLE DATA ");
      console.log(data);
      res.render("company_profile", { data });
    })
    .catch((err) => {
      console.error(
        "Erreur lors de la lecture des utilisateurs : " + err.message
      );
      // Gérez l'erreur ici en fonction de votre besoin
    });
};

//Profile
exports.deleteCompanyProfile = (req, res) => {
  const company_contact_id = req.params.id;
  const sqlDeleteProfile = `DELETE FROM company_profile WHERE company_profile_id = ?`;
  const sqlDeleteOpportunities = `DELETE FROM company_opportunities WHERE company_profile_id = ?`;
  const sqlDeleteContact = `DELETE FROM company_contact WHERE company_profile_id = ?`;
  const sqlDeleteProject = `DELETE FROM company_project WHERE company_profile_id = ?`;

  const values = [company_contact_id];
  const redirectUrl = `/company-dashboard`;

  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:" + err.message);
      return res.status(500).send("Error starting transaction");
    }

    db.query(sqlDeleteProject, values, (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error deleting project user:" + err.message);
          res.status(500).send("Error deleting project user");
        });
      }
      console.log("Project successfully deleted");

      db.query(sqlDeleteContact, values, (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error deleting contact user:" + err.message);
            res.status(500).send("Error deleting contact user");
          });
        }
        console.log("Contact successfully deleted");

        db.query(sqlDeleteOpportunities, values, (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error deleting opportunities user:" + err.message);
              res.status(500).send("Error deleting opportunities user");
            });
          }
          console.log("Opportunities successfully deleted");

          db.query(sqlDeleteProfile, values, (err, result) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error deleting profile user:" + err.message);
                res.status(500).send("Error deleting profile user");
              });
            }
            console.log("Profile successfully deleted");

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Error committing transaction:" + err.message);
                  res.status(500).send("Error committing transaction");
                });
              }
              console.log("Transaction committed successfully");
              res.redirect(redirectUrl);
            });
          });
        });
      });
    });
  });
};

//Contact
exports.createCompanyContact = (req, res) => {
  const contactData = req.body;
  const company_id = req.params.id;
  console.log(contactData);

  const redirectUrl = `/company-profile/${encodeURIComponent(
    company_id
  )}/contact`;
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

exports.deleteCompanyContact = (req, res) => {
  const company_profile_id = req.params.id;
  const company_contact_id = req.body.company_contact_id;
  const sqlDeleteContact =
    "DELETE FROM company_contact WHERE company_contact_id = ?";

  const values = company_contact_id;
  const redirectUrl = `/company-profile/${encodeURIComponent(
    company_profile_id
  )}/contact`;

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
//Project
exports.createCompanyProject = (req, res) => {
  const projectData = req.body;
  const company_id = req.params.id;
  console.log(projectData);

  const redirectUrl = `/company-profile/${encodeURIComponent(
    company_id
  )}/project`;
  const sql =
    "INSERT INTO company_project (title, start_date, end_date, description, company_profile_id) VALUES (?, ?, ?, ?, ?)";
  const values = [
    projectData.title,
    projectData.start_date,
    projectData.end_date,
    projectData.description,
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

exports.deleteCompanyProject = (req, res) => {
  const company_profile_id = req.body.company_profile_id;
  const company_project_id = req.body.company_project_id;
  const sqlDeleteProject =
    "DELETE FROM company_project WHERE company_project_id = ?";

  const values = company_project_id;
  console.log(values);
  const redirectUrl = `/company-profile/${encodeURIComponent(
    company_profile_id
  )}/project`;

  console.log(redirectUrl);

  db.query(sqlDeleteProject, values, (err, result) => {
    if (err) {
      console.error("Error deleting project:" + err.message);
      res.status(500).send("Error deleting project");
    } else {
      console.log("Project successfully deleted");
      res.redirect(redirectUrl);
    }
  });
};

//Opportunities
exports.createCompanyOpportunities = (req, res) => {
  const projectData = req.body;
  const company_id = req.params.id;
  console.log(projectData);

  const redirectUrl = `/company-profile/${encodeURIComponent(
    company_id
  )}/opportunities`;
  const sql =
    "INSERT INTO company_opportunities (title, consultant, certification, history, company_profile_id) VALUES (?, ?, ?, ?, ?)";
  const values = [
    projectData.title,
    projectData.consultant,
    projectData.certification,
    projectData.history,
    company_id,
  ];

  console.log(values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("Error :" + err.message);
      res.status(500).send("Error creating opportunities");
    } else {
      console.log("Opportunities successfully created");
      console.log(result);
      res.redirect(redirectUrl);
    }
  });
};

exports.deleteCompanyOpportunities = (req, res) => {
  const company_profile_id = req.body.company_profile_id;
  const company_project_id = req.body.company_opportunities_id;
  const sqlDeleteOpportunities =
    "DELETE FROM company_opportunities WHERE company_opportunities_id = ?";

  const values = company_project_id;
  console.log(values);
  const redirectUrl = `/company-profile/${encodeURIComponent(
    company_profile_id
  )}/opportunities`;

  console.log(redirectUrl);

  db.query(sqlDeleteOpportunities, values, (err, result) => {
    if (err) {
      console.error("Error deleting project:" + err.message);
      res.status(500).send("Error deleting project");
    } else {
      console.log("Project successfully deleted");
      res.redirect(redirectUrl);
    }
  });
};

//Comapny Dashboard
exports.createCompany = (req, res) => {
  const companyData = req.body;
  console.log(companyData);

  const redirectUrl = `/company-dashboard`;
  const sql = "INSERT INTO company_profile (name) VALUES (?)";
  const values = [companyData.name];

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

//Company dashboard view

exports.getCompanyDashboard = (req, res) => {
  const sql = "SELECT * FROM company_profile";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des données depuis la base de données:",
        err
      );
      res.render("error"); // Créez une vue error.ejs appropriée
    } else {
      const companyProfile = results;
      console.log(companyProfile);
      res.render("company_dashboard", { companyProfile });
    }
  });
};
