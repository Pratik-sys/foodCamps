module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "Please Sign in to do that!!");
    res.redirect("/login");
  },
  authorize: (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.send("<h1>unauthorize user access</h1>");
      }
      next();
    };
  },
};
