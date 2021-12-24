const express = require("express");
const router = express.Router();
const passport = require("passport");
const { User } = require("../models");
const bcrypt = require("bcrypt");

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
    successFlash: "Welcome to FoodCamp!",
  }),
  (req, res) => {
    res.redirect("/foodgrounds");
  }
);

// logout route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Hasta la Vista!");
  res.redirect("/foodgrounds");
});

module.exports = router;
