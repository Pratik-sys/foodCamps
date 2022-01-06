const express = require("express");
const router = express.Router();
const passport = require("passport");
const { User, Foodground } = require("../models");
const bcrypt = require("bcrypt");
const middleware = require("../middleware");
const Cloudinary = require("../utils/Cloudinary");

//root route
router.get("/", (req, res) => {
  res.render("landing");
});

// show register form
router.get("/register", (req, res) => {
  res.render("register", { page: "register" });
});

//handle sign up logic
router.post("/register", async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    await new User({
      name: req.body.username,
      password: hash,
      avatar_image: {
        cloudinary_ID: process.env.DEFAULT_AVATAR_ID,
        path: process.env.DEFAULT_AVATAR_URL,
      },
    }).save();
    req.flash(
      "success",
      "Successfully Signed Up! Nice to meet you " + req.body.username
    );
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    return res.render("register", { error: err.message });
  }
});

//show login form
router.get("/login", (req, res) => {
  res.render("login", { page: "login" });
});

//handling login logic
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    if (req.user.role != "admin") {
      req.flash("success", `Welcome to Foodgrounds ${req.user.name}!`);
      res.redirect("/foodgrounds");
    } else {
      req.flash("success", `Welcome back Admin ${req.user.name}!`);
      res.redirect("admin/list-alluser");
    }
  }
);
router.get("/user-details", middleware.isLoggedIn, async (req, res) => {
  const user = await User.findById({ _id: req.user._id });
  res.render("details", { user: user });
});
router.put("/edit-user-details", middleware.isLoggedIn, async (req, res) => {
  imageDetails = {};
  try {
    const user = await User.findById({ _id: req.user._id });
    if (req.body.image) {
      imageDetails = await Cloudinary.CloudinaryUpload(
        req.body.image,
        req.user.name,
        "Users"
      );
      await Cloudinary.DeleteImage(user.avatar_image.cloudinary_ID);
    } else {
      imageDetails = user.avatar_image;
    }
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          avatar_image: imageDetails,
        },
      }
    );
    req.flash("success", "Avatar Updated");
    res.redirect("/user-details");
  } catch (err) {
    await Cloudinary.DeleteImage(imageDetails.cloudinary_ID);
    console.log(err);
  }
});

router.post("/like-foodground/:id", middleware.isLoggedIn, async (req, res) => {
  let updatedUsers = [];
  const foodground = await Foodground.findById(req.params.id);
  if (
    foodground.likes.users.find(
      (ele) => req.user._id.toString() === ele.toString()
    )
  ) {
    foodground.likes.count -= 1;
    updatedUsers = [...foodground.likes.users].filter(
      (ele) => req.user._id.toString() != ele.toString()
    );
  } else {
    foodground.likes.count += 1;
    updatedUsers = [...foodground.likes.users];
    updatedUsers.push(req.user._id);
  }
  foodground.likes.users = updatedUsers;
  await foodground.save();
  res.redirect("/foodgrounds/" + foodground._id);
});
// logout route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Hasta la Vista!");
  res.redirect("/foodgrounds");
});
module.exports = router;
