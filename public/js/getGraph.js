window.onload = () => {
  const ticker = "TSLA";
  console.log("this is ticker", ticker);
  const api = process.env.API_KEY;
  console.log(api);
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${api}`;

  axios.get(url).then((responseFromAPI) => {
    const timeSeries = responseFromAPI.data["Time Series (5min)"];

    const labels = Object.keys(timeSeries);

    const prices = labels.map((label) => timeSeries[label]["4. close"]);
    console.log(labels, prices);

    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Stock Prices",
            data: prices,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "green",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
    });
  });
};
