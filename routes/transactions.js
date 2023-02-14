const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const User = require("../models/User");
const Transaction = require("../models/Transactions");

const fetchUser = require("../middleware/fetchUser");

router.get("/getTransactions", fetchUser, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json({ transactions, user: req.user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
});

router.post("/buy", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id,
      volume = req.body.volume,
      boughtAt = req.body.boughtAt;

    const user = await User.findById(userId).select("-password");
    const totalAmount = volume * boughtAt,
      userAmount = user.balance;

    if (userAmount < totalAmount) {
      return res.send({ msg: "Insufficient Funds" });
    }

    user.balance = userAmount - totalAmount;
    user.save();
    console.log(user);

    let newTransaction = await Transaction.create({
      userId,
      type: "BUY",
      isSettles: false,
      stockId: req.body.stockId,
      volume,
      boughtAt,
      soldAt: 0,
    });

    console.log(newTransaction);
    res.json({ newTransaction });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
});

router.post("/sell", fetchUser, async (req, res) => {
  try {
    const { transactionId, stockId, sellAmount, sellVolume } = req.body;
    const user = await User.findById(req.user.id).select("-password");

    const transaction = await Transaction.findById(transactionId);
    console.log(stockId, transactionId.stockId);
    if (transaction.stockId != stockId) {
      return res.send({ msg: "Stock not found" });
    }

    if (sellVolume > transaction.volume) {
      return res.send({ msg: "Volume exceeds" });
    }

    const sellingAmount = sellAmount * sellVolume;

    if (sellVolume == transaction.volume) transaction.isSettled = true;
    transaction.volume -= sellVolume;
    transaction.soldAt = sellAmount;
    transaction.save();
    user.balance += sellingAmount;
    user.save();

    return res.json({ transaction, success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
});

module.exports = router;