const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  text: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    username: {
      type: String,
    },
    avatar_image: {
      type: String,
    },
  },
  foodground: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "foodground",
  },
});

module.exports = mongoose.model("comment", commentSchema);
