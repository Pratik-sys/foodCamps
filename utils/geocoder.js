const NodeGeocoder = require("node-geocoder");

const opts = {
  provider: "google",
  httpAdapter: "https",
  apiKey: process.env.GEOCODE_API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(opts);

module.exports.LocationGeocoding = async (loc) => {
  const result = await geocoder.geocode(loc);
  return {
    location: result[0].formattedAddress,
    lat: result[0].latitude,
    lng: result[0].longitude,
  };
};
