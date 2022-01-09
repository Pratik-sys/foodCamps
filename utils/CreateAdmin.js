const { User } = require("../models");
const bcrypt = require("bcrypt");
const isEmpyt = require("is-empty");

module.exports.GenAdmin = async (req, res, next) => {
  const admin = await User.findOne({ role: "admin" });
  if (isEmpyt(admin)) {
    await new User({
      name: process.env.ADMINUSERNAME,
      password: await bcrypt.hash(process.env.ADMINPASSWORD, 10),
      role: "admin",
    }).save();
  }
  next();
};
