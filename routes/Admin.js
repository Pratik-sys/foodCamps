const express = require("express");
const Admin = express.Router();

const { AdminController } = require("../controllers");
const { isLoggedIn, authorize } = require("../middleware");

Admin.get(
  "/list-all",
  isLoggedIn,
  authorize("admin"),
  AdminController.Getall
);
Admin.delete(
  "/:id/user-delete",
  isLoggedIn,
  authorize("admin"),
  AdminController.DeleteUser
);

module.exports = Admin;
