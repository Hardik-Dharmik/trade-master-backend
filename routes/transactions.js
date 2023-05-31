const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const User = require("../models/User");
const Transaction = require("../models/Transactions");
const Holding = require("../models/Holdings");

const fetchUser = require("../middleware/fetchUser");

router.get("/getTransactions", fetchUser, async (req, res) => {
  try {
    const holdings = await Holding.find({ userId: req.user.id });
    const userId = req.user.id;

    holdings.sort((a, b) => b.date - a.date)

    let stockIds = [];

    for (let i = 0; i < holdings.length; i++) {
      stockIds.push(holdings[i].stockId);
    }

    const user = await User.findById(userId).select("-password");
    // console.log(user);

    const balanceInfo = {
      totalAmountInvested: 1000000 - user.balance,
      remainingBal: user.balance,
    };

    res.json({ holdings, stockIds, balanceInfo, user: req.user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
});

router.post("/buy", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const purchaseInfo = req.body.purchaseInfo;

    const { stockId, stockNum, price } = purchaseInfo;

    const volume = stockNum,
      boughtAt = price;

    const user = await User.findById(userId).select("-password");

    const totalAmount = volume * boughtAt,
      userAmount = user.balance;

    if (userAmount < totalAmount) {
      return res.send({ msg: "Insufficient Funds" });
    }

    user.balance = userAmount - totalAmount;
    user.save();

    let newHolding = await Holding.create({
      userId,
      stockId,
      volume,
      boughtAt,
      totalAmount,
    });

    // console.log(newHolding);
    res.json({ newHolding });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
});

router.post("/sell", fetchUser, async (req, res) => {
  try {
    let purchaseInfo = req.body.purchaseInfo;

    console.log(purchaseInfo)
    const { holdingId, stockNum, price } = purchaseInfo;
    // const holdingId = holdingID;

    console.log(holdingId)
    const sellVolume = stockNum, sellAmount = price, userId = req.user.id;

    const user = await User.findById(req.user.id).select("-password");

    let holding = await Holding.findOne({ _id: holdingId })
    // console.log(holding)

    const stockId = holding.stockId, boughtAt = holding.boughtAt, holdingVolume = holding.volume;

    const profitLoss = (sellAmount - boughtAt) * sellVolume,
      profitLossPercent = ((sellAmount - boughtAt) / boughtAt) * 100;

    if (holding._id != holdingId) {
      return res.send({ msg: "Holding not found" });
    }

    if (sellVolume > holding.volume) {
      return res.send({ msg: "Volume exceeds" });
    }

    const sellingAmount = sellAmount * sellVolume, userAmount = user.balance;

    let remainingVol = holdingVolume - sellVolume;

    console.log("Holding before -> ", holding);

    if (remainingVol == 0) {
      holding = await Holding.findByIdAndDelete(holdingId);
    } else {
      holding.volume = remainingVol;
      holding.save();
    }
    console.log("Holding after -> ", holding);

    user.balance = userAmount + sellingAmount;
    user.save();

    let newTransaction = await Transaction.create({
      userId,
      stockId,
      volume: sellVolume,
      boughtAt,
      soldAt: sellAmount,
      profitLoss,
      profitLossPercent
    });

    return res.json({ holding, success: true });
  } catch (error) {
    // console.error(error.message);
    res.status(500).send("Some Error occured");
  }
});

module.exports = router;
