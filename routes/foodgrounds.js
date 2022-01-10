const express = require("express");
const Foodground = express.Router();

const { FoodController } = require("../controllers");
const { isLoggedIn, authorize } = require("../middleware");

Foodground.get("/", FoodController.GetFoodground);

Foodground.get(
  "/new",
  isLoggedIn,
  authorize("user"),
  FoodController.AddFoodgroundPage
);

Foodground.get("/:id", FoodController.FoodgroundGetOne);

Foodground.get(
  "/:id/edit",
  isLoggedIn,
  authorize("user"),
  FoodController.FoodgroundUpdatePage
);

Foodground.post("/", FoodController.AddFoodground);

Foodground.put("/:id", FoodController.FoodgroundUpadte);

Foodground.delete(
  "/:id/delete",
  isLoggedIn,
  authorize("user", "admin"),
  FoodController.DeleteFoodground
);

module.exports = Foodground;
