const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  estimatedCostUSD: {
    type: Number,
    default: 0
  },
  timeOfDay: {
    type: String,
    default: "Morning"
  }
});

const PackingItemSchema = new mongoose.Schema({
  item: String,
  category: String,
  isPacked: {
    type: Boolean,
    default: false
  }
});

const TripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    destination: {
      type: String,
      required: true
    },

    destinationType: {
      type: String,
      enum: ["country", "state", "city", "custom"],
      default: "custom"
    },

    destinationContext: {
      type: String,
      default: ""
    },

    durationDays: {
      type: Number,
      required: true
    },

    budgetTier: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true
    },

    interests: [String],

    itinerary: [
      {
        dayNumber: Number,
        activities: [ActivitySchema]
      }
    ],

    hotels: [
      {
        name: String,
        tier: String,
        estimatedCostNightUSD: Number,
        rating: String
      }
    ],

    estimatedBudget: {
      transport: Number,
      accommodation: Number,
      food: Number,
      activities: Number,
      total: Number
    },

    packingList: [PackingItemSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Trip", TripSchema);