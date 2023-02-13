require("dotenv").config();

const connectToMongo = require("./db");
const express = require("express");
const yahooFinance = require("yahoo-finance");
const cors = require("cors");
const bodyParser = require("body-parser");
const request = require("request");
const cheerio = require("cheerio");
const axios = require("axios");

const User = require("./models/User");
const { response } = require("express");

const router = express.Router();
const app = express();
const port = 4000;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectToMongo();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/transaction", require("./routes/transactions"));

app.get("/index", async (req, res) => {
  res.json({ msg: "Hardik" });
});

app.get("/stock/:stockID", async (req, res) => {
  const stockID = req.params.stockID;

  let response = await fetch(
    `https://query1.finance.yahoo.com/v7/finance/quote?formatted=true&crumb=MFOLNtDyW58&lang=en-US&region=IN&symbols=${stockID}&fields=symbol%2CshortName%2ClongName%2CregularMarketPrice%2CregularMarketChange%2CregularMarketChangePercent%2CcorporateActions&corsDomain=finance.yahoo.com`
  );

  response = await response.json();
  res.json({ response: response.quoteResponse });
});

app.post("/getInfo", async (req, res) => {
  console.log(req.body);
  const { range, interval, symbol } = req.body;
  let response = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?region=US&lang=en-US&includePrePost=false&interval=${interval}&useYfid=true&range=${range}&corsDomain=finance.yahoo.com&.tsrc=finance`
  );

  // let response = await fetch(
  //   `https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN?region=US&lang=en-US&includePrePost=false&interval=2m&useYfid=true&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance`
  // );
  response = await response.json();
  res.json({ response: response.chart.result[0] });
});

app.post("/getList", async (req, res) => {
  let response = await fetch(
    "https://query1.finance.yahoo.com/v7/finance/quote?formatted=true&crumb=MFOLNtDyW58&lang=en-US&region=IN&symbols=MKPL-SM.NS%2CSRGSFL.BO%2CMARKO-RE.BO%2CHCC.BO%2CHCC.NS%2CHAZOOR-RE.B&fields=symbol%2CshortName%2ClongName%2CregularMarketPrice%2CregularMarketChange%2CregularMarketChangePercent%2CcorporateActions&corsDomain=finance.yahoo.com"
  );

  response = await response.json();

  res.json({ response });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
