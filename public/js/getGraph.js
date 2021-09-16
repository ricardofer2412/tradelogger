const { default: axios } = require("axios");

// const canvas = document.getElementById("myChart");
// const ctx = canvas.getContext("2d");

// function drawGraph() {
//   var myChart = new Chart(ctx, {
//     type: "bar",
//     data: {
//       labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//       datasets: [
//         {
//           label: "# of Votes",
//           data: [12, 19, 3, 5, 2, 3],
//           backgroundColor: [
//             "rgba(255, 99, 132, 0.2)",
//             "rgba(54, 162, 235, 0.2)",
//             "rgba(255, 206, 86, 0.2)",
//             "rgba(75, 192, 192, 0.2)",
//             "rgba(153, 102, 255, 0.2)",
//             "rgba(255, 159, 64, 0.2)",
//           ],
//           borderColor: [
//             "rgba(255, 99, 132, 1)",
//             "rgba(54, 162, 235, 1)",
//             "rgba(255, 206, 86, 1)",
//             "rgba(75, 192, 192, 1)",
//             "rgba(153, 102, 255, 1)",
//             "rgba(255, 159, 64, 1)",
//           ],
//           borderWidth: 1,
//         },
//       ],
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//         },
//       },
//     },
//   });
// }

const apiKey = "RZHOBZ5MUSOW2S61";

async function getPrices() {
  console.log("get prices");
  const res = await axios.get(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${apiKey}`
  );
  console.log(res);
}
// drawGraph();

getPrices();
