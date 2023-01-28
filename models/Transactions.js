const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  type: {
    type: String,
    required: true,
  },
  isSettled: {
    type: Boolean,
    default: false,
  },
  stockId: {
    type: String,
    required: true,
  },
  volume: {
    type: Integer,
    required: true,
  },
  boughtAt: {
    type: Double,
    required: true,
  },
  soldAt: {
    type: Double,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model("transaction", Transaction);
module.exports = Transaction;
