const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role :{
    type: String,
    enum:["user", "admin"],
    default : "user",
    required : true
  }
});

module.exports = mongoose.model("user", UserSchema);
