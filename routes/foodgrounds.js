const express = require("express");
const router = express.Router();
const { Foodground, Comment } = require("../models");
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
router.post(
  "/",
  middleware.isLoggedIn,
  middleware.authorize("user"),
  async (req, res) => {
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
  }
);

//New - show form to create a new Foodground
router.get(
  "/new",
  middleware.isLoggedIn,
  middleware.authorize("user"),
  (req, res) => {
    res.render("foodgrounds/new");
  }
);

//Show - shows more info about one Foodground
router.get("/:id", async (req, res) => {
  try {
    const foodground = await Foodground.findById(req.params.id).populate(
      "comments"
    );
    if (!foodground) {
      req.flash("error", "No foodground found");
      res.redirect("/foodgrounds");
    }
    res.render("foodgrounds/show", { foodground: foodground });
  } catch (err) {
    console.log(err);
  }
});

router.get(
  "/:id/edit",
  middleware.isLoggedIn,
  middleware.authorize("user"),
  (req, res) => {
    try {
      Foodground.findById(req.params.id, (err, food) => {
        if (!food) {
          req.flash("error", "No foodground found");
          res.redirect("/foodgrounds");
        }
        res.render("foodgrounds/edit", { foodground: food });
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.put("/:id", async (req, res) => {
  imageDetails = {};
  try {
    const foodground = await Foodground.findOne({
      _id: req.params.id,
    });
    if (req.body.image) {
      imageDetails = await Cloudinary.CloudinaryUpload(
        req.body.image,
        req.body.name || foodground.name
      );
      await Cloudinary.DeleteImage(foodgroound.image.cloudinary_ID);
    } else {
      imageDetails = foodground.image;
    }
    const data = await Geocoder.LocationGeocoding(req.body.location);
    await Foodground.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name || foodground.name,
          image: imageDetails,
          description: req.body.description || foodground.description,
          cost: req.body.cost || foodground.cost,
          location: data.location || foodground.location,
          lat: data.lat || foodground.lat,
          lng: data.lng || foodground.lng,
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

router.delete(
  "/:id/delete",
  middleware.isLoggedIn,
  middleware.authorize("user", "admin"),
  async (req, res) => {
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
      await Comment.deleteMany({ _id: foodground.comments });
      req.flash("success", "Foodground deleted!");
      if (req.user.role != "admin") {
        res.redirect("/foodgrounds");
      } else {
        res.redirect("/admin/list-alluser");
      }
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
