const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

app.listen(7000, () => {
  console.log("backend server is running!");
});

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db connection is successfull!"))
  .catch((err) => console.log(err));
