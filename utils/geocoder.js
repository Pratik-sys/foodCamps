const NodeGeocoder = require("node-geocoder");
require("dotenv").config();

const opts = {
  provider: "google",
  httpAdapter: "https",
  apiKey: process.env.GEOCODE_API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(opts);

module.exports = geocoder;
