const finnhub = require("finnhub");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "c4psplqad3icgcuepmdg";
const finnhubClient = new finnhub.DefaultApi();

const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

//search for stock
router.get("/quote", isLoggedIn, (req, res, next) => {
  const query = req.query.symbol;
  const stock = query.toUpperCase();

  finnhubClient.quote(`${stock}`, (error, quoteData, response) => {
    finnhubClient.companyProfile2(
      { symbol: stock },
      (error, companyData, response) => {
        console.log(companyData);

        res.render("stocks/stocks-info", { quoteData, companyData, stock });
      }
    );
  });
});

module.exports = router;
