const {
  generateTravelPlan
} = require(
  "../services/geminiService"
);
const Trip = require("../models/Trip");

exports.createTrip = async (
  req,
  res
) => {
  try {
    const {
      destination,
      durationDays,
      budgetTier,
      interests
    } = req.body;

    const aiResult =
      await generateTravelPlan({
        destination,
        durationDays,
        budgetTier,
        interests
      });

    const trip =
      await Trip.create({
        userId: req.user.id,

        destination,
        durationDays,
        budgetTier,
        interests,

        itinerary:
          aiResult.itinerary,

        hotels:
          aiResult.hotels,

        estimatedBudget:
          aiResult.estimatedBudget,

        packingList:
          aiResult.packingList
      });

    res.status(201).json(trip);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Trip generation failed"
    });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      userId: req.user.id
    });

    res.json(trips);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch trips"
    });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch trip"
    });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    res.json({
      message: "Trip deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed"
    });
  }
};

exports.addActivity = async (req, res) => {
  try {
    const {
      dayNumber,
      activity
    } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    const day = trip.itinerary.find(
  d => d.dayNumber === Number(dayNumber)
);

    if (!day) {
      return res.status(404).json({
        message: "Day not found"
      });
    }

    day.activities.push(activity);

    await trip.save();

    res.json(trip);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add activity"
    });
  }
};

exports.removeActivity = async (
  req,
  res
) => {
  try {
    const {
      dayNumber,
      activityId
    } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    const day = trip.itinerary.find(
  d => d.dayNumber === Number(dayNumber)
);

    if (!day) {
      return res.status(404).json({
        message: "Day not found"
      });
    }

    day.activities =
      day.activities.filter(
        a =>
          a._id.toString() !== activityId
      );

    await trip.save();

    res.json(trip);
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove activity"
    });
  }
};

exports.regenerateDay = async (
  req,
  res
) => {
  try {
    const { dayNumber } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    const day = trip.itinerary.find(
  d => d.dayNumber === Number(dayNumber)
);

    if (!day) {
      return res.status(404).json({
        message: "Day not found"
      });
    }

    day.activities = [
      {
        title: "Outdoor Adventure",
        description:
          "AI Regenerated Activity",
        estimatedCostUSD: 40,
        timeOfDay: "Morning"
      }
    ];

    await trip.save();

    res.json(day);
  } catch (error) {
    res.status(500).json({
      message: "Failed to regenerate"
    });
  }
};