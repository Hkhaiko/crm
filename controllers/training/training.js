const db = require("../../config/db");

const extractTypeFromUrl = (url) => {
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];
  return lastPart;
};

exports.createTraningUser = (req, res) => {
  const updatedUserData = req.body; // Les données de l'utilisateur à partir du corps de la demande

  // Run a SQL query to insert the user into the database
  const sql =
    "INSERT INTO training (certificationCode, fullname, company, position, email, telephone, date, title, futureTopics, user_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    updatedUserData.certificationCode,
    updatedUserData.fullname,
    updatedUserData.company,
    updatedUserData.position,
    updatedUserData.email,
    updatedUserData.telephone,
    updatedUserData.date,
    updatedUserData.title,
    updatedUserData.futureTopics,
    updatedUserData.trainingType,
  ];

  console.log(values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating training: " + err.message);
      res.status(500).send("Error creating training");
    } else {
      console.log("training created successfully");
      res.status(201).send("training created successfully");
    }
  });
};

exports.deleteTraningUsers = (req, res) => {
  const trainingId = req.params.id;
  const sql = "DELETE FROM training WHERE training_id = ?";
  const sqlPdf =
    "DELETE FROM pdf WHERE formation_id IN (SELECT formation_id FROM formation WHERE training_id = ?)";
  const sqlFormation = "DELETE FROM formation WHERE training_id = ?";
  const sqlCompany = "DELETE FROM company_experience WHERE training_id = ?";
  const redirectUrl = "/dashboard";
  const values = [trainingId];

  // Début de la transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:" + err.message);
      return res.status(500).send("Error starting transaction");
    }

    // Deletion of PDF
    db.query(sqlPdf, values, (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error deleting pdf:" + err.message);
          res.status(500).send("Error deleting pdf");
        });
      }
      console.log("User pdf deleted");

      // Suppression des Formations
      db.query(sqlFormation, values, (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error deleting Formation:" + err.message);
            res.status(500).send("Error deleting Formation");
          });
        }
        console.log("Formation successfully deleted");

        // Deletion of Company Experiences
        db.query(sqlCompany, values, (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error deleting Company:" + err.message);
              res.status(500).send("Error deleting Company");
            });
          }
          console.log("Company successfully deleted");

          // Removal of Main Training
          db.query(sql, values, (err, result) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error deleting Traningser:" + err.message);
                res.status(500).send("Error deleting TraningUser");
              });
            }

            // If all operations were successful, we validate the transaction
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

exports.getTraningUsers = (req, res) => {
  // Run a SQL query to select all users from the database
  const sql = "SELECT * FROM training";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la lecture des utilisateurs : " + err.message
      );
      res.status(500).send("Erreur lors de la lecture des utilisateurs");
    } else {
      const training = results;
      console.log(training);
      console.log("Utilisateurs lus avec succès");
      res.status(200).json(results);
      res.render("training_user", { training });
    }
  });
};

exports.updatedTraningUserData = (req, res) => {
  const trainingId = req.params.id;
  const updatedUserData = req.body;
  const redirectUrl = `/training-user/${encodeURIComponent(
    trainingId
  )}/experience`;

  // Run a SQL query to update the user in the database
  const sql =
    "UPDATE training SET certificationCode = ?, fullName = ?, company = ?, position = ?, email = ?, telephone = ?, date = ?, title = ?, futureTopics = ? WHERE training_id = ?";
  const values = [
    updatedUserData.certificationCode,
    updatedUserData.fullName,
    updatedUserData.company,
    updatedUserData.position,
    updatedUserData.email,
    updatedUserData.telephone,
    updatedUserData.date,
    updatedUserData.title,
    updatedUserData.futureTopics,
    trainingId,
  ];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la mise à jour de l'utilisateur : " + err.message
      );
      res.status(500).send("Erreur lors de la mise à jour de l'utilisateur");
    } else {
      const trainingUpdate = results;
      console.log(trainingUpdate);
      console.log("Utilisateur mis à jour avec succès");
      res.redirect(redirectUrl);
    }
  });
};

exports.getTraningUserById = (req, res) => {
  const sqlCompany = `SELECT * FROM company_experience WHERE training_id = ?`;
  const sqlFormation = `SELECT * FROM formation WHERE training_id = ?`;
  const sqlTraning = `SELECT * FROM training WHERE training_id = ?`;
  const sqlPdf = `SELECT pdf.path FROM pdf JOIN formation ON pdf.formation_id = formation.formation_id
  WHERE formation.training_id = ?`;
  const values = req.params.id;
  const redirectUrl = `/training-user/${encodeURIComponent(values)}`;

  let trainingResults;
  let companyResults;
  let formationResults;
  let pdfResults;
  let contentTypeResults = extractTypeFromUrl(req.url);

  // Use Promises or async/await to handle requests asynchronously
  Promise.all([
    new Promise((resolve, reject) => {
      db.query(sqlFormation, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          formationResults = results;
          resolve(formationResults);
        }
      });
    }),
    new Promise((resolve, reject) => {
      db.query(sqlCompany, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          companyResults = results;
          resolve(companyResults);
        }
      });
    }),
    new Promise((resolve, reject) => {
      db.query(sqlTraning, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          trainingResults = results;
          resolve(trainingResults);
        }
      });
    }),
    new Promise((resolve, reject) => {
      db.query(sqlPdf, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          pdfResults = results;
          resolve(pdfResults);
        }
      });
    }),
  ])
    .then(() => {
      // Once all requests have completed, you can call res.render
      const data = {
        trainingFormation: formationResults,
        trainingCompany: companyResults,
        trainingProfile: trainingResults,
        contentTypeResult: contentTypeResults,
        pdfResult: pdfResults,
      };
      console.log("CONSOLE DATA ");
      console.log(data);
      res.render("training_user", { data });
    })
    .catch((err) => {
      console.error(
        "Erreur lors de la lecture des utilisateurs : " + err.message
      );
    });
};
