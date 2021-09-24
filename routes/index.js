const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");
const Account = require("../models/Account.model");
const finnhub = require("finnhub");
const Trade = require("../models/Trade.model");
const Watchlist = require('../models/Watchlist.model')

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "";
const finnhubClient = new finnhub.DefaultApi();

/* GET home page */
router.get("/", isLoggedOut, (req, res, next) => {
  res.render("index");
});

router.get("/", isLoggedIn, (req, res, next) => {
  res.render("dashboard/dashboard");
});

router.get("/dashboard", isLoggedIn, (req, res, next) => {
  const user = req.session.currentUser._id;

  Account.find({ userId: { $eq: user } }).then((account) => {
    const accountId = account[0]._id;
    console.log(accountId);
    Trade.find({ accountId: { $eq: accountId } }).then((trade) => {
      console.log("This is trade ", trade);
      let sumBalance = 0;
      for (let i = 0; i < trade.length; i++) {
        sumBalance = trade[i].tradeValue + sumBalance;
      }
      const userId = req.session.currentUser._id
     
      Watchlist.find({authorId: userId}).then((watchList) => {
        
        let newAccountBalance = sumBalance + account[0].buyingPower;            
        const accountInfo = account[0];

        
      //   for (let i = 0; i < watchList.length; i++) {
      //     let arrOfObj = []
      //   const ticker = watchList[i].tickerId
        
      //   finnhubClient.quote(ticker, (error, data, response) => {
          
      //     let prices = data.c;
      //     arrOfObj.push({ticker: ticker, price: prices})
      //     // console.log(ticker)
      //     // console.log(prices)
      //   })
      // return arrOfObj;
      // };
          // console.log('this is arra of obj',arrOfObj)      
          
          
      finnhubClient.marketNews("general", {}, (error, data, response) => {
        const news = data;
              res.render("dashboard/dashboard", { accountInfo, news, trade, watchList});
            })
          
              
      });
      // console.log("this is sum", sumBalance);
      // console.log("This is new Balance", newAccountBalance);
    });
  });
});

module.exports = router;
