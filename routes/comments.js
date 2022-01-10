const express = require("express");
const Comment = express.Router({ mergeParams: true });

const { CommentController } = require("../controllers");
const { isLoggedIn, authorize } = require("../middleware");

Comment.get(
  "/new",
  isLoggedIn,
  authorize("user"),
  CommentController.CommentAddPage
);
Comment.get(
  "/:commentId/edit",
  isLoggedIn,
  authorize("user"),
  CommentController.CommentEditPage
);
Comment.post("/", CommentController.CommentAdd);
Comment.put("/:commentId", CommentController.CommentUpdate);
Comment.delete(
  "/:commentId",
  isLoggedIn,
  authorize("user", "admin"),
  CommentController.DeleteComment
);

module.exports = Comment;
