const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const User = require("../models/User");
const Transaction = require("../models/Transactions");
const WatchList = require("../models/WatchList");

const fetchUser = require("../middleware/fetchUser");

// GET WatchList
router.get("/getWatchlist", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;

    let watchlist = await WatchList.findOne({ userId: req.user.id });

    if (!watchlist) {
      watchlist = await WatchList.create({
        userId,
      });
    }

    res.json({ watchlist, user: req.user, msg: "Hardik" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
});

// ADD to Watchlist
router.post("/addToWatchlist", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id,
      stockId = req.body.stockId;

    // console.log(stockId, userId);
    console.log(req.user);
    if (stockId === null) {
      return res.json({ error: "Invalid stock ID" });
    }

    const watchlist = await WatchList.findOne({ userId: req.user.id });
    console.log(watchlist);

    if (watchlist.stockIds.includes(stockId) === false) {
      watchlist.stockIds.push(stockId);
    }

    await watchlist.save();

    res.json({ watchlist });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
});

// REMOVE from WatchList
router.post("/removeFromWatchlist", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id,
      stockId = req.body.stockId;

    if (stockId === null) {
      return res.json({ error: "Invalid stock ID" });
    }

    let watchlist = await WatchList.findOne({ userId: req.user.id });

    let stockIds = watchlist.stockIds;

    stockIds = stockIds.filter((ids) => {
      return ids !== stockId;
    });

    watchlist.stockIds = stockIds;
    await watchlist.save();

    res.json({ watchlist });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
});

module.exports = router;
