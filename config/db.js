const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'CRM',
    port: 3306
  });

db.connect((err) => {
    if (err) {
      console.error('MySQL connection error: ' + err.message);
    } else {
      console.log('Connected at MySQL');
    }
});

module.exports = db;