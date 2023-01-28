const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const User = require("../models/User");
const fetchUser = require("../middleware/fetchUser");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const saltedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
      name: req.body.name,
      password: saltedPassword,
      email: req.body.email,
    });

    const data = {
      user: {
        id: user.id,
      },
    };

    const authtoken = jwt.sign(data, JWT_SECRET);

    res.json({ authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  let success = false;
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      success = false;
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const passwordComparision = await bcrypt.compare(password, user.password);

    if (!passwordComparision) {
      success = false;
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const data = {
      user: {
        id: user.id,
      },
    };

    const authtoken = jwt.sign(data, JWT_SECRET);

    success = true;

    res.json({ success, authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// LOGOUT
router.put("/logout", (req, res) => {
  const authHeader = req.headers["AUTH_TOKEN"];

  if (!authHeader) res.send({ msg: "Error" });

  jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      res.send({ msg: "You have been Logged Out" });
    } else {
      res.send({ msg: "Error" });
    }
  });
});

// GET USER INFO
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    let userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
});

module.exports = router;
