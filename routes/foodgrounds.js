const express = require("express");
const router = express.Router();
const { Foodground } = require("../models");
const middleware = require("../middleware");
// const NodeGeocoder = require("node-geocoder");

// const opts = {
//   provider: "google",
//   httpAdapter: "https",
//   apiKey: "AIzaSyB4f5h5SyjKA9hm5KQSQz35OvLAO-c8zFA",
//   formatter: null,
// };
// const geocoder = NodeGeocoder(opts);

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
  try {
    // const geocodes = await geocoder.geocode(req.body.location);
    await new Foodground({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      cost: req.body.cost,
      location: req.body.location,
      // lat: geocoes[0].latitude,
      // lng: geocodes[0].longitude,
      author: {
        id: req.user.id,
        username: req.user.name,
      },
    }).save();
    res.redirect("/foodgrounds");
  } catch (err) {
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
    console.log(foodground);
    if (foodground) {
      res.render("foodgrounds/show", { foodground: foodground });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id/edit", middleware.checkUserFoodground, async (req, res) => {
  //find the foodground with suitable Id
  try {
    await Foodground.findById(req.params.id, (err, food) => {
      if (food) {
        console.log(food);
        res.render("foodgrounds/edit", { foodground: food });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    await Foodground.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          image: req.body.image,
          description: req.body.description,
          cost: req.body.cost,
          location: req.body.location,
        },
      }
    );
    req.flash("success", "Successfully Updated!");
    res.redirect("/foodgrounds/" + foodground._id);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const foodground = await Foodground.findOne({
      _id: req.params.id,
    });
    if (!foodground) {
      req.flash("error", foodground.name + "deleted");
      res.redirect("/foodfrounds");
    }
    await foodground.remove({ _id: foodground.id });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
