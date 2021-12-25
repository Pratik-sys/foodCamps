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
  "/:id/delete",
  middleware.isLoggedIn,
  middleware.authorize("admin"),
  async (req, res) => {
    try {
      const foodground = await Foodground.findOne({
        _id: req.params.id,
      });
      if (!foodground) {
        req.flash("error", foodground.name + "can't be deleted");
        res.redirect("/foodgrounds");
      }
      await Cloudinary.DeleteImage(foodground.image.cloudinary_ID);
      await foodground.remove({ _id: foodground.id });
      await Comment.deleteMany({ _id: foodground.comments });
      req.flash("success", "Foodground deleted!");
      res.redirect("admin/list");
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
