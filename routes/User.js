const express = require("express");
const User = express.Router();
const passport = require("passport");

const { UserController } = require("../controllers");
const { isLoggedIn, authorize } = require("../middleware");

User.get("/", UserController.GetLandingPage);
User.get("/login", UserController.GetLoginPage);
User.get("/user-details", UserController.GetUserDetails);
User.get("/register", UserController.GetRegisterPage);
User.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  UserController.Login
);
User.post("/register", UserController.Register);
User.get("/logout", UserController.Logout);
User.put("/edit-user-details", isLoggedIn, UserController.EditUserDetails);
User.post(
  "/like-foodground/:id",
  isLoggedIn,
  authorize("user"),
  UserController.FoodgroundLike
);

module.exports = User;
