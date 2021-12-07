const express = require("express");
const router = express.Router({ mergeParams: true });
const { Foodground } = require("../models");
const { Comment } = require("../models");
const middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, (req, res) => {
  try {
    Foodground.findById(req.params.id, (err, foodground) => {
      if (foodground) {
        res.render("comments/new", { foodground: foodground });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//Comments Create
router.post("/", middleware.isLoggedIn, (req, res) => {
  //lookup campground using ID\
  try {
    Foodground.findById(req.params.id, async (err, foodground) => {
      if (foodground) {
        const comment = await new Comment({
          text: req.body.text,
          author: {
            id: req.user.id,
            username: req.user.name,
          },
        });
        comment.save();
        foodground.comments.push(comment);
        foodground.save();
        req.flash("success", "Created a comment!");
        res.redirect("/foodgrounds/" + foodground._id);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:commentId/edit", middleware.isLoggedIn, (req, res) => {
  // finding  foodground by id first.
  try {
    Comment.findById(req.params.commentId, (err, comment) => {
      if (comment) {
        res.render("comments/edit", {
          foodground_id: req.params.id,
          comment: comment,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.put("/:commentId", async (req, res) => {
  try {
    await Comment.findByIdAndUpdate(
      { _id: req.params.commentId },
      {
        $set: {
          text: req.body.text,
        },
      }
    );
    res.redirect("/foodgrounds/" + req.params.id);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:commentId", middleware.checkUserComment, (req, res) => {
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
        req.flash("error", "Comment deleted!");
        res.redirect("/foodgrounds/" + req.params.id);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
