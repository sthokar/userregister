module.exports = {
  showLoginForm(req, res) {
    console.log('got here');
    res.render('auth/login');
  },

  showRegisterForm(req, res) {
    res.render('auth/register');
  },

  handleCreateUser(req, res) {
    res.redirect('/myHome');
  },
  handleLogout(req, res) {
    res.redirect('/');
  },
  handleDelete(req, res) {
    res.redirect('/quotes');
  },
};
