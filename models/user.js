const mongoose = require("mongoose");
const Bcrypt = require("bcrypt");
const isEmpty = require("is-empty");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: function (p) {
        return p.match("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])");
      },
      message:
        "Password must contain atleast 1 lowercase, 1 uppercase & 1 special characters & 1 numeric digit",
    },
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
  this.password = await Bcrypt.hash(this.password, 10);
  next();
});

UserSchema.post("save", async function (err, doc, next) {
  if (err.name === "MongoServerError" && err.code === 11000) {
    next("User already present");
  }
  next();
});

module.exports = mongoose.model("user", UserSchema);
