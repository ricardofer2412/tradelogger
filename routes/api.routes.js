const finnhub = require('finnhub');
const express = require("express");
const router = express.Router(); 

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "c4psplqad3icgcuepmdg"
const finnhubClient = new finnhub.DefaultApi()


router.get('/stocks', (req, res, next) => {
    finnhubClient.stockSymbols("US", (error, data, response) => {
  console.log(data)
});
})



module.exports = router;