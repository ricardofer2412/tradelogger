<<<<<<< HEAD
=======
const finnhub = require("finnhub");
const router = require("../routes");

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "budf5mn48v6ped90n62g";
const finnhubClient = new finnhub.DefaultApi();

console.log("api request");

router.get("/stocks/:stock", (req, res, next) => {
  finnhubClient.quote("TSLA", (error, data, response) => {
    console.log("Tesla Price: ", data.o);
  });
});
>>>>>>> 0ffd86d6d894859e63784bd826c5c5dd41ac97cc
