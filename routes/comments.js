var express = require("express");
var router  = express.Router({mergeParams: true});
var Foodground = require("../models/foodground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find foodground by the ID
    console.log(req.params.id);
    Foodground.findById(req.params.id, function(err, foodground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {foodground: foodground});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   Foodground.findById(req.params.id, function(err, foodground){
       if(err){
           console.log(err);
           res.redirect("/foodgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               foodground.comments.push(comment);
               foodground.save();
               console.log(comment);
               req.flash('success', 'Created a comment!');
               res.redirect('/foodgrounds/' + foodground._id);
           }
        });
       }
   });
});

router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
    // finding  foodground by id first.
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {foodground_id: req.params.id, comment: comment});
        }
    })
});

router.put("/:commentId", function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
          console.log(err);
           res.render("edit");
       } else {
           res.redirect("/foodgrounds/" + req.params.id);
       }
   }); 
});

router.delete("/:commentId",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
            Foodground.findByIdAndUpdate(req.params.id, {
              $pull: {
                comments: comment.id
              }
            }, function(err) {
              if(err){ 
                console.log(err)
              } else {
                req.flash('error', 'Comment deleted!');
                res.redirect("/foodgrounds/" + req.params.id);
              }
            });
        }
    });
});

module.exports = router;