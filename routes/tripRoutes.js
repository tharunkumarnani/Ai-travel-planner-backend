const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  createTrip,
  getTrips,
  getTripById,
  deleteTrip,
  addActivity,
  removeActivity,
  regenerateDay
} = require(
  "../controllers/tripController"
);

router.post("/", auth, createTrip);

router.get("/", auth, getTrips);

router.get("/:id", auth, getTripById);

router.delete(
  "/:id",
  auth,
  deleteTrip
);

router.post(
  "/:id/activity",
  auth,
  addActivity
);

router.delete(
  "/:id/activity",
  auth,
  removeActivity
);

router.post(
  "/:id/regenerate-day",
  auth,
  regenerateDay
);

module.exports = router;