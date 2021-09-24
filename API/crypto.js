const finnhub = require("finnhub");
const router = require("../routes");

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = API_KEY;
const finnhubClient = new finnhub.DefaultApi();

console.log("api request");

router.get("/stocks/:stock", (req, res, next) => {
  finnhubClient.quote("TSLA", (error, data, response) => {
    console.log("Tesla Price: ", data.o);
  });
});
