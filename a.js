async function logJSONData() {
  const response = await fetch(
    "https://query2.finance.yahoo.com/v6/finance/quote?formatted=true&crumb=MFOLNtDyW58&lang=en-US&region=IN&symbols=TATASTEEL.NS&fields=messageBoardId%2ClongName%2CshortName%2CmarketCap%2CunderlyingSymbol%2CunderlyingExchangeSymbol%2CheadSymbolAsString%2CregularMarketPrice%2CregularMarketChange%2CregularMarketChangePercent%2CregularMarketVolume%2Cuuid%2CregularMarketOpen%2CfiftyTwoWeekLow%2CfiftyTwoWeekHigh%2CtoCurrency%2CfromCurrency%2CtoExchange%2CfromExchange%2CcorporateActions&corsDomain=finance.yahoo.com"
  );
  const jsonData = await response.json();
  console.log(jsonData);
}

logJSONData();
