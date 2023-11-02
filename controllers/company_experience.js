const db = require('../config/db');


exports.addCompanyExperience = (req, res) => {
    const companyExperienceData = req.body;
    console.log("ici");
    console.log(companyExperienceData);
    console.log(companyExperienceData.traning_id);
    
    const redirectUrl = `/traning-user/${encodeURIComponent(companyExperienceData.traning_id)}`;
    const sql = 'INSERT INTO company_experience (company_name, job_title, start_date, end_date, description, traning_id) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [companyExperienceData.company_name, companyExperienceData.job_title, companyExperienceData.start_date, companyExperienceData.end_date, companyExperienceData.description, companyExperienceData.traning_id];
    console.log(companyExperienceData.traning_id);

    db.query(sql, values, (err, result) =>{
      if (err){
        console.log("Error :" + err.message);
        res.status(500).send('Error creating company experience');
      } else{
        console.log('Company experience successfully created');
        console.log(result);
        res.redirect(redirectUrl);
      }
    })  
}

exports.deleteCompanyExperience = (req, res) => {
  const companyExperienceData = req.body;
  const redirectUrl = `/traning-user/${encodeURIComponent(companyExperienceData.traning_id)}`;
  const sql = 'DELETE FROM company_experience WHERE company_experience_id = ?';
  const values = companyExperienceData.company_experience_id;
  console.log("ici");
  console.log(companyExperienceData.company_experience_id);
  console.log("ici");

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log(sql);
      console.error('Error deleting company experience:' + err.message);
      res.status(500).send('Error deleting company experience');
    } else {
      console.log('Successfully deleted');
      res.redirect(redirectUrl);
    }
  });
}

