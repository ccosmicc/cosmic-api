const express = require("express");
const router = express.Router();
const { verifyTokenAndAuthorization } = require("./verifyToken");
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

    const { password, ...others } = updatedUser._doc;
    return res.status(200).json(others);
  } catch (error) {
    return res.status(500).json(err);
  }
});

module.exports = router;
