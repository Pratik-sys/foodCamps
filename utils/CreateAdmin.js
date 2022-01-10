const { User } = require("../models");
const bcrypt = require("bcrypt");
const isEmpyt = require("is-empty");

module.exports.GenAdmin = async (req, res, next) => {
  const admin = await User.findOne({ role: "admin" });
  if (isEmpyt(admin)) {
    await new User({
      name: process.env.ADMINUSERNAME,
      password: process.env.ADMINPASSWORD,
      avatar_image: {
        cloudinary_ID: process.env.ADMIN_AVATAR_ID,
        path: process.env.ADMIN_AVATAR_URL,
      },
      role: "admin",
    }).save();
  }
  next();
};
