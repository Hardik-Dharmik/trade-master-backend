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
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectToMongo();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/transaction", require("./routes/transactions"));
app.use("/api/watchlist", require("./routes/watchlist"));

app.get("/index", async (req, res) => {
  res.json({ msg: "Hardik" });
});

app.get("/stock/:stockID", async (req, res) => {
  const stockID = req.params.stockID;
  console.log(stockID);
  let response = await fetch(
    `https://query2.finance.yahoo.com/v7/finance/quote?formatted=true&crumb=MFOLNtDyW58&lang=en-US&region=IN&symbols=${stockID}&fields=messageBoardId%2ClongName%2CshortName%2CmarketCap%2CunderlyingSymbol%2CunderlyingExchangeSymbol%2CheadSymbolAsString%2CregularMarketPrice%2CregularMarketChange%2CregularMarketChangePercent%2CregularMarketVolume%2Cuuid%2CregularMarketOpen%2CfiftyTwoWeekLow%2CfiftyTwoWeekHigh%2CtoCurrency%2CfromCurrency%2CtoExchange%2CfromExchange%2CcorporateActions&corsDomain=finance.yahoo.com`,
    {
      mode: "no-cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Cookie:
          "B=3n9p3uhhf9pl7&b=3&s=ad; A1=d=AQABBKfm9GICEDpxu-DzUwmKn3iwifQjpzsFEgEBCAHNXGSGZFlQb2UB_eMBAAcIp-b0YvQjpzs&S=AQAAAkSx81FqzxuKeUlKINSeYNs; A3=d=AQABBKfm9GICEDpxu-DzUwmKn3iwifQjpzsFEgEBCAHNXGSGZFlQb2UB_eMBAAcIp-b0YvQjpzs&S=AQAAAkSx81FqzxuKeUlKINSeYNs; gam_id=y-mcMX.cdE2uIo_WJcPO9C.56RwbMGzYC1~A; tbla_id=5beeaaa9-ca3a-46e8-8aa9-73684d09e9dc-tuct9ee6c25; GUC=AQEBCAFkXM1khkIemwR1; A1S=d=AQABBKfm9GICEDpxu-DzUwmKn3iwifQjpzsFEgEBCAHNXGSGZFlQb2UB_eMBAAcIp-b0YvQjpzs&S=AQAAAkSx81FqzxuKeUlKINSeYNs&j=WORLD; cmp=t=1685010512&j=0&u=1---; PRF=t%3DTATASTEEL.NS%252B%255EFTSE%252BRR.L%252BIAG.L%252BEDV.L%252BTATASTEEL.BO%252BGLEN.L%252BFRAS.L%252BAAPL%252BMSFT.NE%252BTCS.NS%252BADANIENT.BO%252BBHARTIARTL.NS%252BWIPRO.NS%252BASIANPAINT.NS%26qct%3Dline%26newChartbetateaser%3D1",
      },
    }
  );

  response = await response.json();
  console.log(response);
  res.json({ response: response.quoteResponse });
});

app.get("/history/:stockID/:interval/:range", async (req, res) => {
  const { range, interval, stockID } = req.params;
  console.log(req.params);
  let response = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${stockID}?region=US&lang=en-US&includePrePost=false&interval=${interval}&useYfid=true&range=${range}&corsDomain=finance.yahoo.com&.tsrc=finance`
  );

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
