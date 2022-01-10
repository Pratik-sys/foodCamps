const { Foodground, Comment } = require("../models");

exports.CommentAddPage = async (req, res) => {
  const foodground = await Foodground.findById(req.params.id);
  if (!foodground) {
    req.flash("danger", "No Foodground to comment");
    res.redirect("/foodgrounds");
  }
  res.render("comments/new", { foodground: foodground });
};

exports.CommentAdd = (req, res) => {
  try {
    Foodground.findById(req.params.id, async (err, foodground) => {
      if (foodground) {
        await new Comment({
          text: req.body.text,
          author: {
            id: req.user.id,
            username: req.user.name,
            avatar_image: req.user.avatar_image.path,
          },
          foodground: foodground,
        }).save((error, comment) => {
          if (error) {
            let commenterror = {};
            Object.values(error.errors).map(
              (x) => (commenterror[x.path] = x.message)
            );
            res.render("comments/new", {
              error: commenterror,
              foodground: foodground,
            });
          } else {
            foodground.comments.push(comment);
            foodground.save();
            req.flash("success", "Created a comment!");
            res.redirect("/foodgrounds/" + foodground._id);
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

exports.CommentEditPage = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId).populate(
    "foodground"
  );
  if (!comment) {
    req.flash("danger", "No comment foud to edit");
    res.redirect("/foodgrounds" + req.params.id);
  }
  res.render("comments/edit", {
    foodground_id: req.params.id,
    comment: comment,
  });
};

exports.CommentUpdate = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.commentId });
    if (comment) {
      await Comment.findByIdAndUpdate(
        { _id: req.params.commentId },
        {
          $set: {
            text: req.body.text || comment.text,
          },
        }
      );
      res.redirect("/foodgrounds/" + req.params.id);
    }
  } catch (err) {
    console.log(err);
  }
};
exports.DeleteComment = (req, res) => {
  try {
    Comment.findByIdAndRemove(req.params.commentId, (err, comment) => {
      if (comment) {
        Foodground.findByIdAndUpdate(
          { _id: req.params.id },
          {
            $pull: {
              comments: comment.id,
            },
          }
        );
        req.flash("success", "Comment deleted!");
        if (req.user.role != "admin") {
          res.redirect("/foodgrounds/" + req.params.id);
        } else {
          res.redirect("/admin/list-all");
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};
