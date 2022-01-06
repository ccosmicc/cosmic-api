const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  // save user to the db
  // try-catch block since it is CRUD operation
  try {
    const savedUser = await newUser.save();

    // destructuring
    const { password, ...others } = savedUser._doc;
    res.status(201).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
