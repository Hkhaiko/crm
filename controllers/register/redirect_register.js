exports.getRegisterRedirect = (req, res) => {
  console.log("= == = == = ==Register REDIRECT = == = = = ==");

  const credentials = req.session.credentials;
  console.log(credentials);

  res.render("register_redirect", { credentials });
};
