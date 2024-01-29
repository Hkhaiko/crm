const db = require("../../config/db");
const nodemailer = require("nodemailer");

exports.getAdmin = (req, res) => {
  res.render("admin_dashboard", { adminMessage: "" });
};

exports.updateAdminRole = (req, res) => {
  const sqlAdd = `UPDATE user SET isAdmin = 1 WHERE email = ?`;
  const sqlRemove = `UPDATE user SET isAdmin = 0 WHERE email = ?`;
  const sqlCheckEmail = `SELECT email from user WHERE email = ?`;

  const isAdminMessage = "Change made this user is now admin";
  const isNotAdminMessage = "Change made this user is no longer admin";

  const email = req.body.email;
  const role = req.body.role;

  const checkEmailPromise = new Promise((resolve, reject) => {
    db.query(sqlCheckEmail, [email], (err, result) => {
      if (err) {
        console.log("Error :", err);
        reject(err);
      } else {
        if (result.length > 0) {
          // L'email existe, résoudre la promesse avec true
          resolve(true);
        } else {
          // L'email n'existe pas, résoudre la promesse avec false
          resolve(false);
        }
      }
    });
  });

  checkEmailPromise
    .then((emailExists) => {
      if (emailExists) {
        if (role === "admin") {
          db.query(sqlAdd, [email], (err, result) => {
            if (err) {
              console.log("Error :", err);
            } else {
              console.log("Admin role change successfully");
              res.render("admin_dashboard", {
                adminMessage: isAdminMessage,
              });
            }
          });
        } else {
          db.query(sqlRemove, [email], (err, result) => {
            if (err) {
              console.log("Error :", err);
            } else {
              console.log("Admin role change successfully");
              res.render("admin_dashboard", {
                adminMessage: isNotAdminMessage,
              });
            }
          });
        }
      } else {
        // L'email n'existe pas dans la base de données
        console.log("Email does not exist in the database");
        res.status(404).send("Email not found");
      }
    })
    .catch((error) => {
      console.log("Error:", error);
      res.status(500).send("Internal Server Error");
    });
};

exports.emailSender = (req, res) => {
  const redirectUrl = "/admin";
  const sqlUserData = `SELECT formation.title, training.fullName, training.email, formation.training_id FROM formation
  INNER JOIN training ON formation.training_id = training.training_id
  WHERE formation.title = ?`;
  const titleSelected = req.body.standard;
  console.log(req.body);
  console.log(titleSelected);

  const getEmailPromise = new Promise((resolve, reject) => {
    db.query(sqlUserData, [titleSelected], (err, result) => {
      if (err) {
        console.log("Error :", err);
        reject(err);
      } else {
        console.log("Successfully get email");
        resolve(result);
      }
    });
  });

  getEmailPromise.then((result) => {
    console.log(result);
    console.log(result[0].email);

    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "italyziacontact@gmail.com",
        pass: `eaaasvzaszkcffpk`,
      },
    });

    result.forEach((user) => {
      const { fullName, title } = user;
      const messageText = req.body.message
        .replace("@name", fullName)
        .replace("@iso-name", title);

      console.log(messageText);
      const message = {
        from: "italyziacontact@gmail.com",
        to: "haik.h@live.fr",
        subject: "Renew ISO",
        text: messageText,
      };

      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    });
  });

  res.redirect(redirectUrl);
};
