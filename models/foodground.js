const mongoose = require("mongoose");

const foodgroundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  cost: {
    type: Number,
  },
  location: {
    type: String,
  },
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
    },
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Foodground", foodgroundSchema);
