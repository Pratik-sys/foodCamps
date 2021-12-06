const { Comment } = require("../models");
const { Foodground } = require("../models");
module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "Please Sign in to do that!!");
    res.redirect("/login");
  },

  checkUserFoodground: (req, res, next) => {
    if (req.isAuthenticated()) {
      Foodground.findById(req.params.id, function (err, foodground) {
        if (err) {
          console.log("error", "No Foodground Found");
          res.redirect("back");
        } else {
          if (foodground.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You are not authorized");
            console.log("Not Good1!!");
            res.redirect("/foodgrounds/" + req.params.id);
          }
        }
      });
    } else {
      req.flash("error", "You should Sign in to Proceed Further");
      res.redirect("/login");
    }
  },

  checkUserComment: (req, res, next) => {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.commentId, (err, comment) => {
        if (err) {
          res.redirect("back");
        } else {
          // does user own the comment?
          if (comment.author.id.toString() === req.user._id.toString()) {
            next();
          } else {
            req.flash("error", "You are not authorized");
            req.redirect("/foodgrounds/" + req.params.id);
          }
        }
      });
    } else {
      req.flash("error", "You should sign in to Proceed Further");
      res.redirect("login");
    }
  },
};
