const { User, Foodground, Comment } = require("../models");

exports.Getall = async (req, res) => {
  const user = await User.find({});
  const foodground = await Foodground.find({});
  const comment = await Comment.find({});
  res.render("admin/list", {
    user: user,
    foodground: foodground,
    comment: comment,
  });
};

exports.DeleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.params.id });
    req.flash("success", "User deleted!");
    res.redirect("/admin/list-all");
  } catch (err) {
    console.log(err);
  }
};
