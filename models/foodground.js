const mongoose = require("mongoose");

const foodgroundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    cloudinary_ID: {
      type: String,
    },
    path: {
      type: String,
    },
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
      ref: "user",
    },
    username: {
      type: String,
    },
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "comment",
  },
  likes: {
    count: {
      type: Number,
      default: 0,
    },
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
    },
  },
});

module.exports = mongoose.model("foodground", foodgroundSchema);
