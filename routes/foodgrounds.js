const express = require("express");
const router = express.Router();
const { Foodground } = require("../models");
const middleware = require("../middleware");
const Geocoder = require("../utils/Geocoder");
const Cloudinary = require("../utils/Cloudinary");

//the Function to add the Search feature
function theRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^|#\s]/g, "\\$&");
}

//Index - to show all the foodgrounds
router.get("/", (req, res) => {
  try {
    if (req.query.search && req.xhr) {
      const regex = new RegExp(theRegex(req.query.search), "gi");
      //to get the foodgrounds from Database
      Foodground.find({ name: regex }, (err, allFoodgrounds) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json(allFoodgrounds);
        }
      });
    } else {
      Foodground.find({}, (err, allFoodgrounds) => {
        if (err) {
          console.log("err");
        } else {
          if (req.xhr) {
            res.json(allFoodgrounds);
          } else {
            res.render("foodgrounds/index", {
              foodgrounds: allFoodgrounds,
              page: "foodgrounds",
            });
          }
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

//Create - add new foodground to DB
router.post("/", middleware.isLoggedIn, async (req, res) => {
  imageDetails = {};
  try {
    if (req.body.image) {
      imageDetails = await Cloudinary.CloudinaryUpload(
        req.body.image,
        req.body.name
      );
    } else {
      imageDetails = {
        cloudinary_ID: process.env.DEFAULT_IMAGE_ID,
        path: process.env.DEFAULT_IMAGE_URL,
      };
    }
    const data = await Geocoder.LocationGeocoding(req.body.location);
    await new Foodground({
      name: req.body.name,
      image: imageDetails,
      description: req.body.description,
      cost: req.body.cost,
      location: data.location,
      lat: data.lat,
      lng: data.lng,
      author: {
        id: req.user.id,
        username: req.user.name,
      },
    }).save();
    res.redirect("/foodgrounds");
  } catch (err) {
    await Cloudinary.DeleteImage(imageDetails.cloudinary_ID);
    console.log(err);
  }
});

//New - show form to create a new Foodground
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("foodgrounds/new");
});

//Show - shows more info about one Foodground
router.get("/:id", async (req, res) => {
  try {
    const foodground = await Foodground.findById(req.params.id).populate(
      "comments"
    );
    if (foodground) {
      res.render("foodgrounds/show", { foodground: foodground });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id/edit", middleware.checkUserFoodground, (req, res) => {
  //find the foodground with suitable Id
  try {
    Foodground.findById(req.params.id, (err, food) => {
      if (food) {
        res.render("foodgrounds/edit", { foodground: food });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", async (req, res) => {
  imageDetails = {};
  try {
    if (req.body.image) {
      imageDetails = await Cloudinary.CloudinaryUpload(
        req.body.image,
        req.body.name
      );
    } else {
      imageDetails = {};
    }
    const data = await Geocoder.LocationGeocoding(req.body.location);
    const foodground = await Foodground.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          image: imageDetails,
          description: req.body.description,
          cost: req.body.cost,
          location: data.location,
          lat: data.lat,
          lng: data.lng,
        },
      }
    );
    req.flash("success", "Successfully Updated!");
    res.redirect("/foodgrounds/" + foodground._id);
  } catch (err) {
    await Cloudinary.DeleteImage(imageDetails.cloudinary_ID);
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const foodground = await Foodground.findOne({
      _id: req.params.id,
    });
    if (!foodground) {
      req.flash("error", foodground.name + "can't be deleted");
      res.redirect("/foodgrounds");
    }
    await Cloudinary.DeleteImage(foodground.image.cloudinary_ID);
    await foodground.remove({ _id: foodground.id });
    req.flash("Sucess", foodground.name + "deleted");
    res.redirect("/foodgrounds");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
