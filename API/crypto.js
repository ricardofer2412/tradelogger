const finnhub = require("finnhub");

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "budf5mn48v6ped90n62g";
const finnhubClient = new finnhub.DefaultApi();

window.onload = () => {
  console.log("api request");

  finnhubClient.quote("CHPT", (error, data, response) => {
    console.log(data);
  });
};
