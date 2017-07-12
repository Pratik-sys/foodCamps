var Comment    = require("../models/comment");
var Foodground = require("../models/foodground");
module.exports = {
    isLoggedIn : function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "Please Sign in to do that!!");
        res.redirect("/login");
    },
    
    checkUserFoodground : function(req, res, next) {
        if(req.isAuthenticated()){
            Foodground.findById(req.params.id, function(err, foodground){
                if(err){
                    console.log("error", "No Foodground Found");
                    res.redirect("back");
                } else {
                if(foodground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You are not authorized");
                    console.log("Not Good1!!");
                    res.redirect("/foodgrounds/" + req.params.id);
                  } 
                }  
            });
             
        } else {
            req.flash("error", "You should Sign in to Proceed Further");
            res.redirect("/login");
        }
    },
    
    checkUserComment : function(req, res, next) {
        console.log("Till The comment");
        if(req.isAuthenticated()) {
            Comment.findByID(req.params.CommentId, function(err, comment){
                if(err){
                    res.redirect("back");
                } else {
                    // does user own the comment?
                    if(comment.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "You are not authorized");
                        req.redirect("/foodgrounds/" + req.params.id);
                    }
                }
            });
        } else {
            req.flash("error", "You should sign in to Proceed Further");
            res.redirect("login");
        }
    }
};