const mongoose = require("mongoose");
const Bcrypt = require("bcrypt");
const isEmpty = require("is-empty");

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

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await Bcrypt.genHash(this.password, 10);
  next();
});

UserSchema.post("save", async function (err, doc, next) {
  let uniqueError = {};
  const username = await mongoose.models["user"].findOne({ name: doc.name });
  if (username) {
    uniqueError.name = "User already present";
  }
  if (!isEmpty(uniqueError)) {
    next(uniqueError);
  }
  next();
});

module.exports = mongoose.model("user", UserSchema);
