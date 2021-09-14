const finnhub = require("finnhub");
const express = require("express");
const router = express.Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");
const User = require("../models/User.model.js");
const { hydrate } = require("../models/User.model.js");
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "c4psplqad3icgcuepmdg"
const finnhubClient = new finnhub.DefaultApi()

router.get("/news", isLoggedIn,(req, res, next) => {
    const query = req.query.symbol;
    console.log(req.query);
    res.render("news/news");
    const marketNews = query.toUpperCase();
    const user = req.session.currentUser._id;
    console.log(user);
    
    finnhubClient.marketNews("general", {marketNews}, (error, data, response) => {
      console.log(data)
    });
    
 });


module.exports =  router;finnhubClient.marketNews("general", {}, (error, data, response) => {
  console.log(data)
});
