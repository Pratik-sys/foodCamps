const mongoose = require("mongoose");

const foodgroundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
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
    required: [true, "Please provide description"],
  },
  cost: {
    type: Number,
    required: [true, "Mention the cost"],
    min: [0, "Negative value not suported"],
  },
  location: {
    type: String,
    required: [true, "Location needed"],
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
  openingTime: {
    type: String,
    required: [true, "Please provide the opening time"],
  },
  closingTime: {
    type: String,
    required: [true, "Please provide the closing time"],
  },
  contactNumber: {
    type: Number,
    required: [true, "Please provide the contact number"],
  },
});

module.exports = mongoose.model("foodground", foodgroundSchema);
