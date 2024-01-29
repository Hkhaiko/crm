const db = require("../../config/db");

exports.getTrainingForm = (req, res) => {
  res.render("redirect_training_form");
};

exports.createUser = (req, res) => {
  db.query(sql, (err, result) => {
    if (err) {
      console.log("Error :", err);
    } else {
      console.log(" Credentials created successfully");
    }
  });
};

exports.addClient = (req, res) => {
  const trainingClient = req.body;
  const sql =
    "INSERT INTO training (certificationCode, fullName, company, position, email, telephone, date, title, futureTopics, user_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const sqlGetTraining = `SELECT * from training where email = ?`;
  const sqlUserCreation = `INSERT INTO user (name, email, password, training_id, isAdmin) VALUES (?, ?, ?, ?, ?)`;
  const credentialsEmail = req.session.credentials.email;
  const credentialsUser = req.session.credentials;

  console.log(credentialsEmail);

  // VERFIER QUE LE MAIL DE LA SESSION ET POUR CRER SON COMPTE SON COMPTE SON LE MEME SINON REDIRIGER SUR LA MEME PAGE
  const data = [
    trainingClient.certificationCode,
    trainingClient.fullName,
    trainingClient.company,
    trainingClient.position,
    trainingClient.email,
    trainingClient.telephone,
    trainingClient.date,
    trainingClient.title,
    trainingClient.futureTopics,
    trainingClient.trainingType,
  ];

  db.query(sql, data, (err, result) => {
    if (err) {
      console.log("Error :" + err.message);
      res.status(500).send("Error creating client");
    } else {
      console.log("Created client successfully");
      console.log(result);
    }
  });

  const getTrainingPromise = new Promise((resolve, reject) => {
    db.query(sqlGetTraining, credentialsEmail, (err, result) => {
      if (err) {
        console.log("Error :" + err.message);
        res.status(500).send("Error creating client");
        reject(err);
      } else {
        console.log("GETING TRAINING successfully");
        console.log(result);
        resolve(result);
      }
    });
  });

  getTrainingPromise.then((results) => {
    const training_id = results[0].training_id.toString();
    const userValues = [
      credentialsUser.name,
      credentialsUser.email,
      credentialsUser.password,
      training_id,
      "0",
    ];
    console.log(use);
    db.query(sqlUserCreation, userValues, (err, result) => {
      if (err) {
        console.log("Error :" + err.message);
        res.status(500).send("Error creating client");
      } else {
        console.log("User successfully create");

        res.redirect(`/training-user/${training_id}/experience`);
      }
    });
  });
};
