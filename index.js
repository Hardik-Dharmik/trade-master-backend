require("dotenv").config();

const connectToMongo = require("./db");

const express = require("express");
const router = express.Router();

var bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const User = require("./models/User");

connectToMongo();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/transaction", require("./routes/transactions"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
