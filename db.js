const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.PROD_MONGODB_URI;

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to Mongo Successfully");
  });
};

module.exports = connectToMongo;
