const mongoose = require("mongoose");
const { Schema } = mongoose;

const HoldingSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  stockId: {
    type: String,
    required: true,
  },

  volume: {
    type: Number,
    required: true,
  },

  boughtAt: {
    type: mongoose.Types.Decimal128,
    required: true,
  },

  totalAmount: {
    type: mongoose.Types.Decimal128,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const Holding = mongoose.model("Holding", HoldingSchema);
module.exports = Holding;
