module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "Please Sign in to do that!!");
    res.redirect("/login");
  },
};
