const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");
const Account = require("../models/Account.model");
const finnhub = require("finnhub");
const Trade = require("../models/Trade.model");
const Watchlist = require("../models/Watchlist.model");

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

router.post("/delete/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  Watchlist.findByIdAndDelete(id).then(() => {
    console.log("Ticker remove from Watchlist");
    res.redirect("back");
  });
});

router.get("/dashboard", isLoggedIn, (req, res, next) => {
  const user = req.session.currentUser._id;

  Account.find({ userId: { $eq: user } }).then((account) => {
    const accountId = account[0]._id;
    Trade.find({ accountId: { $eq: accountId } }).then((trade) => {
      let sumBalance = 0;
      for (let i = 0; i < trade.length; i++) {
        sumBalance = trade[i].tradeValue + sumBalance;
      }
      const userId = req.session.currentUser._id;

      Watchlist.find({ authorId: userId }).then((watchList) => {
        let newAccountBalance = sumBalance + account[0].buyingPower;
        const accountInfo = account[0];
        const arrOfObj = [];
        for (let i = 0; i < watchList.length; i++) {
          const ticker = watchList[i].tickerId;
          finnhubClient.quote(ticker, (error, data, response) => {
            const testArr = [];
            let prices = data.c;

            arrOfObj.push({ ticker: ticker, price: prices });
            // console.log(ticker)
          });
        }
        // Promise.all(arrOfObj).then()

        finnhubClient.marketNews("general", {}, (error, data, response) => {
          const news = data;

          res.render("dashboard/dashboard", {
            accountInfo,
            news,
            trade,
            watchList,
          });
        });
      });
      // console.log("this is sum", sumBalance);
      // console.log("This is new Balance", newAccountBalance);
    });
  });
});

module.exports = router;
