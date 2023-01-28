const mongoose = require("mongoose");
const { Schema } = mongoose;

const WatchListSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  stockId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const WatchList = mongoose.model("watchlist", WatchListSchema);
module.exports = WatchList;
