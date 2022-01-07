const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: true,
  },
  avatar_image: {
    cloudinary_ID: {
      type: String,
    },
    path: {
      type: String,
    },
  },
});

module.exports = mongoose.model("user", UserSchema);
