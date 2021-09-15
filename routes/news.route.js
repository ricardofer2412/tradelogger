const finnhub = require("finnhub");
const express = require("express");
const router = express.Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");
const User = require("../models/User.model.js");
const { hydrate } = require("../models/User.model.js");
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "c4psplqad3icgcuepmdg"
const finnhubClient = new finnhub.DefaultApi()

router.get("/", isLoggedIn,(req, res, next) => {
    
    finnhubClient.marketNews("general", {}, (error, data, response) => {
console.log(data)
      res.render("news/news", {news: data})
    });

 });

 router.get("/crypto", isLoggedIn,(req, res, next) => {
    
  finnhubClient.marketNews("crypto", {}, (error, data, response) => {
console.log(data)
    res.render("news/crypto", {news: data})
  });

});

router.get("/forex", isLoggedIn,(req, res, next) => {
    
  finnhubClient.marketNews("forex", {}, (error, data, response) => {
console.log(data)
    res.render("news/forex", {news: data})
  });

});

router.get("/merger", isLoggedIn,(req, res, next) => {
    
  finnhubClient.marketNews("merger", {}, (error, data, response) => {
console.log(data)
    res.render("news/merger", {news: data})
  });

});

module.exports =  router;