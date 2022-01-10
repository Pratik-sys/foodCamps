const { User, Foodground } = require("../models");
const { Cloudinary } = require("../utils");

exports.GetLandingPage = (req, res) => {
  res.render("landing");
};

exports.GetRegisterPage = (req, res) => {
  res.render("register");
};

exports.Register = async (req, res) => {
  try {
    await new User({
      name: req.body.username,
      password: req.body.password,
      avatar_image: {
        cloudinary_ID: process.env.DEFAULT_AVATAR_ID,
        path: process.env.DEFAULT_AVATAR_URL,
      },
    }).save((error, user) => {
      if (error) {
        let usererror = {};
        typeof error.errors != "undefined"
          ? Object.values(error.errors).map(
              (x) => (usererror[x.path] = x.message)
            )
          : (usererror = error);
        return res.render("register", { error: usererror });
      } else {
        req.flash(
          "success",
          "Successfully Signed Up! Nice to meet you " + req.body.username
        );
        res.redirect("/login");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

exports.GetLoginPage = (req, res) => {
  res.render("login");
};

exports.Login = (req, res) => {
  if (req.user.role != "admin") {
    req.flash("success", `Welcome to Foodgrounds ${req.user.name}!`);
    res.redirect("/foodgrounds");
  } else {
    req.flash("success", `Welcome back Admin ${req.user.name}!`);
    res.redirect("admin/list-all");
  }
};

exports.GetUserDetails = async (req, res) => {
  const user = await User.findById({ _id: req.user._id });
  res.render("details", { user: user });
};

exports.EditUserDetails = async (req, res) => {
  imageDetails = {};
  try {
    const user = await User.findById({ _id: req.user._id });
    if (req.body.image) {
      imageDetails = await Cloudinary.CloudinaryUpload(
        req.body.image,
        req.user.name,
        "Users"
      );
      await Cloudinary.DeleteImage(user.avatar_image.cloudinary_ID);
    } else {
      imageDetails = user.avatar_image;
    }
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          avatar_image: imageDetails,
        },
      }
    );
    req.flash("success", "Avatar Updated");
    res.redirect("/user-details");
  } catch (err) {
    await Cloudinary.DeleteImage(imageDetails.cloudinary_ID);
    console.log(err);
  }
};

exports.FoodgroundLike = async (req, res) => {
  try {
    let updatedUsers = [];
    const foodground = await Foodground.findById(req.params.id);
    if (
      foodground.likes.users.find(
        (ele) => req.user._id.toString() === ele.toString()
      )
    ) {
      foodground.likes.count -= 1;
      updatedUsers = [...foodground.likes.users].filter(
        (ele) => req.user._id.toString() != ele.toString()
      );
    } else {
      foodground.likes.count += 1;
      updatedUsers = [...foodground.likes.users];
      updatedUsers.push(req.user._id);
    }
    foodground.likes.users = updatedUsers;
    await foodground.save();
    res.redirect("/foodgrounds/" + foodground._id);
  } catch (err) {
    console.log(err);
  }
};

exports.Logout = (req, res) => {
  req.logout();
  req.flash("success", "Vist us Again");
  res.redirect("/foodgrounds");
};
