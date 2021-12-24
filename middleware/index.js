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
        return res.send(
          "<script>function Redirect(){window.location='/foodgrounds';} alert('Unautorize access you will be redirected to foodgrounds in 5 seconds'); setTimeout(Redirect(),5000);</script>"
        );
      }
      next();
    };
  },
};
