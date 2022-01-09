const express = require("express");
const router = express.Router();
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const User = require("../models/User");

router.get("/test", (req, res) => {
  res.send("test :))");
});

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //if user updates the password, we should encrypt it first.

  if (req.body.password) {
    req.body.passqord = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    //destructuring
    const { password, ...others } = updatedUser._doc;
    return res.status(200).json(others);
  } catch (error) {
    return res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json("User has been deleted");
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(1)
      : await User.find();

    //users are an array of objects including password field.
    const finalUsers = users.map((user) => {
      const { password, ...others } = user._doc;
      return others;
    });

    return res.status(200).json(finalUsers);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
