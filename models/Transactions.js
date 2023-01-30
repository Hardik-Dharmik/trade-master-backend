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
    type: Number,
    required: true,
  },
  boughtAt: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  soldAt: {
    type: mongoose.Types.Decimal128,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model("transaction", TransactionSchema);
module.exports = Transaction;
