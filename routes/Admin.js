const express = require("express");
const router = express.Router();
const { Foodground } = require("../models");
const { Comment } = require("../models");
const { User } = require("../models");
const middleware = require("../middleware");
const Cloudinary = require("../utils/Cloudinary");

router.get(
  "/list-alluser",
  middleware.isLoggedIn,
  middleware.authorize("admin"),
  async (req, res) => {
    try {
      const user = await User.find({});
      const foodground = await Foodground.find({});
      const comment = await Comment.find({});
      if (!user) {
        req.flash("error", "no users listed");
      }
      res.render("admin/list", {
        user: user,
        foodground: foodground,
        comment: comment,
      });
    } catch (err) {
      console.log(err);
    }
  }
);
router.delete(
  "/:id/user-delete",
  middleware.isLoggedIn,
  middleware.authorize("admin"),
  async (req, res) => {
    try {
      await User.findByIdAndDelete({ _id: req.params.id });
      console.log(user);
      req.flash("success", "User deleted!");
      res.redirect("/admin/list-alluser");
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
