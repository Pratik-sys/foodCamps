var express    = require("express");
var router     = express.Router();
var Foodground = require("../models/foodground");
var Comment    = require("../models/comment");
var middleware = require("../middleware");
var geocoder   = require("geocoder")

//the Function to add the Search feature
function theRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^|#\s]/g, "\\$&");
}

//Index - to show all the foodgrounds 
router.get("/", function (req, res){
    if(req.query.search && req.xhr) {
        const regex = new RegExp(theRegex(req.query.search), 'gi');
        //to get the foodgrounds from Database
        Foodground.find({name: regex}, function(err, allFoodgrounds){
            if (err){
                console.log(err);
            } else {
                res.status(200).json(allFoodgrounds);
            }
        });
    } else {
        Foodground.find({}, function(err, allFoodgrounds){
            if(err) {
                console.log("err")
            } else {
                if(req.xhr) {
                    res.json(allFoodgrounds);
                } else {
                  res.render("foodgrounds/index", {foodgrounds: allFoodgrounds, page: 'foodgrounds'});
                }
            }
        });
    }
});


//Create - add new foodground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to Foodground Array
    var name   = req.body.name;
    var image  = req.body.image;
    var desc   = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var cost   = req.body.cost;
    geocoder.geocode(req.body.location, function(err, data){
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newFoodground = {name: name, image: image, description: desc, cost:cost, author:author, location:location, lat:lat, lng:lng};
        //create a new afoodground nad saving to the Database
        Foodground.create(newFoodground, function(err, newCreated){
            if(err){
                console.log(err);
            } else {
                console.log(newCreated);
                res.redirect("/foodgrounds");
            }
        });
    });
});


//New - show form to create a new Foodground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("foodgrounds/new");
})

//SHow - shows more info about one Foodground
router.get("/:id", function(req, res){
    //finding with the suitable ID 
    Foodground.findById(req.params.id).populate("comments").exec(function(err, foundFoodground){
        if(err){
            console.log(err);
        } else {
            console.log(foundFoodground);
            //render show template
            res.render("foodgrounds/show", {foodground: foundFoodground})
        }
    });
});

router.get("/:id/edit", middleware.checkUserFoodground, function(req, res){
    //find the foodground with suitable Id
    Foodground.findById(req.params.id, function(err,foundFoodground){
        if(err){
            console.log(err);
        } else {
            //render show template with that specific foodground
            res.render("foodgrounds/edit", {foodground:foundFoodground});
        }
    });
});

router.put("/:id", function(req, res){
    geocoder.geocode(req.body.location, function(err, data){
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    Foodground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, foodground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/foodgrounds/" + foodground._id);
        }
    });
  });
});

router.delete("/:id", function(req, res) {
  Foodground.findByIdAndRemove(req.params.id, function(err, foodground) {
    Comment.remove({
      _id: {
        $in: foodground.comments
      }
    }, function(err, comments) {
      req.flash('error', foodground.name + ' deleted!');
      res.redirect('/foodgrounds');
    })
  });
});

module.exports = router;