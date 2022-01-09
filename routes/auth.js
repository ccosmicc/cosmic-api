const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

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
    return res.status(201).json(others);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return res.status(401).json("Wrong credentials!");

    // if user is found, check the password.
    // decrypt the password in the db
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== req.body.password)
      return res.status(401).json("Wrong password!");

    //if login successful, create token.
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SEC,
      {
        expiresIn: "3d",
      }
    );
    // destructuring
    const { password, ...others } = user._doc;
    return res.status(200).json({ ...others, accessToken });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
