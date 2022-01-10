const { Foodground, Comment } = require("../models");
const { Cloudinary, Geocoder } = require("../utils");

function theRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^|#\s]/g, "\\$&");
}
exports.GetFoodground = (req, res) => {
  try {
    if (req.query.search && req.xhr) {
      const regex = new RegExp(theRegex(req.query.search), "gi");
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
};

exports.AddFoodgroundPage = (req, res) => {
  res.render("foodgrounds/new");
};

exports.AddFoodground = async (req, res) => {
  imageDetails = {};
  try {
    if (req.body.image) {
      imageDetails = await Cloudinary.CloudinaryUpload(
        req.body.image,
        req.body.name,
        "foodgrounds"
      );
    } else {
      imageDetails = {
        cloudinary_ID: process.env.DEFAULT_IMAGE_ID,
        path: process.env.DEFAULT_IMAGE_URL,
      };
    }
    // const data =
    //   req.body.location != ""
    //     ? await Geocoder.LocationGeocoding(req.body.location)
    //     : "";
    await new Foodground({
      name: req.body.name,
      image: imageDetails,
      description: req.body.description,
      cost: req.body.cost,
      location: req.body.location,
      // location: data.location,
      // lat: data.lat,
      // lng: data.lng,
      author: {
        id: req.user.id,
        username: req.user.name,
      },
      openingTime: req.body.opentime,
      closingTime: req.body.closetime,
      contactNumber: req.body.contactNumber,
    }).save((error, foodground) => {
      if (error) {
        let foodgrounderror = {};
        Object.values(error.errors).map(
          (x) => (foodgrounderror[x.path] = x.message)
        );
        res.render("foodgrounds/new", { error: foodgrounderror });
      }
      req.flash("success", "Added new Foodground");
      res.redirect("/foodgrounds");
    });
  } catch (err) {
    await Cloudinary.DeleteImage(imageDetails.cloudinary_ID);
    console.log(err);
  }
};

exports.FoodgroundGetOne = async (req, res) => {
  try {
    const foodground = await Foodground.findById(req.params.id).populate(
      "comments"
    );
    if (!foodground) {
      req.flash("danger", "No Foodground found");
      res.redirect("/foodgrounds");
    }
    res.render("foodgrounds/show", { foodground: foodground });
  } catch (err) {
    console.log(err);
  }
};

exports.FoodgroundUpdatePage = async (req, res) => {
  const foodground = await Foodground.findById(req.params.id);
  if (!foodground) {
    req.flash("danger", "No foodground to update");
    res.redirect("/foodgrounds");
  }
  res.render("foodgrounds/edit", { foodground: foodground });
};

exports.FoodgroundUpadte = async (req, res) => {
  imageDetails = {};
  try {
    const foodground = await Foodground.findOne({
      _id: req.params.id,
    });
    if (req.body.image) {
      imageDetails = await Cloudinary.CloudinaryUpload(
        req.body.image,
        req.body.name || foodground.name,
        "foodgrounds"
      );
      await Cloudinary.DeleteImage(foodground.image.cloudinary_ID);
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
};

exports.DeleteFoodground = async (req, res) => {
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
      res.redirect("/admin/list-all");
    }
  } catch (err) {
    console.log(err);
  }
};
