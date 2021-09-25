window.onload = () => {
  const api = "budf5mn48v6ped90n62g";
  //   const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&outputsize=compact&apikey=${api}`;

  //   const ticker = document.getElementById("watchlist-text").outerText;

  const arr = document.querySelectorAll("#watchlist-text");

  console.log(arr);

  for (let i = 0; i < arr.length; i++) {
    const ticker = document.querySelectorAll("#watchlist-text")[i].innerText;

    console.log(ticker);

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${api}`;

    axios.get(url).then((responseFromAPI) => {
      const timeSeries = responseFromAPI.data["Time Series (5min)"];
      // const lastPrice = timeSeries[timeSeries.length - 1];
      const labels = Object.keys(timeSeries);

      const prices = labels.map((label) => timeSeries[label]["4. close"]);

      const lastPrice = prices[prices.length - 1];

      console.log(lastPrice);
      var element = document.getElementById(`currentPrice${i}`);

      element.innerText += Number(lastPrice).toFixed(2);
    });
  }
};
