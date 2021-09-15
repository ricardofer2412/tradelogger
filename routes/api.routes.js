const finnhub = require("finnhub");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "c4psplqad3icgcuepmdg";
const finnhubClient = new finnhub.DefaultApi();
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const Post = require("../models/Post.model");
const Account = require("../models/Account.model");
const Trade = require("../models/Trade.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

//search for stock
router.get("/quote", isLoggedIn, (req, res, next) => {
  const query = req.query.symbol;
  const stock = query.toUpperCase();
  const user = req.session.currentUser._id;

  finnhubClient.quote(`${stock}`, (error, quoteData, response) => {
    finnhubClient.companyProfile2(
      { symbol: stock },
      (error, companyData, response) => {
        finnhubClient.stockCandles(
          stock,
          "D",
          1590988249,
          1591852249,
          (error, candleData, response) => {
            Account.find({ userId: { $eq: user } }).then((account) => {
              const accountMoney = account[0].accountBalance;
              res.render("stocks/stocks-info", {
                candleData,
                quoteData,
                companyData,
                stock,
                accountMoney,
              });
            });
          }
        );
      }
    );
  });
});

//fix different account stock buying
router.post("/quote/:ticker", isLoggedIn, (req, res, next) => {
  const { ticker } = req.params;
  const { entryPrice, sharesNumber } = req.body;
  const userId = req.session.currentUser._id;
  const tradeValue = entryPrice * sharesNumber;

  Account.find({ userId: { $eq: userId } }).then((account) => {
    const accountId = account[0]._id;
    const newAccountBalance = account[0].accountBalance - tradeValue;

    console.log("Account ID", accountId);
    //Check if already own stocks

    //If it does not own it create a new trade
    Trade.findOne({
      ticker: { $eq: ticker },
      accountId: { $eq: accountId },
    }).then((trade) => {
      console.log(trade);
      if (!trade) {
        console.log("Trade does not exits");
        Trade.create({
          entryPrice,
          sharesNumber,
          tradeValue,
          userId,
          accountId,
          ticker,
        }).then((tradeToDB) => {
          console.log(tradeToDB);
          return Account.updateOne(
            { userId: { $eq: userId } },
            { $set: { accountBalance: newAccountBalance } }
          );
          console.log("Post to DB");
        });
      } else {
        console.log("Trade exits");

        Trade.findOne({
          accountId: accountId,
          ticker: ticker,
        }).then((trade) => {
          console.log(trade);
          const newShares = Number(trade.sharesNumber) + Number(sharesNumber);
          const newValue = Number(trade.tradeValue) + Number(tradeValue);
          return Trade.updateOne(
            { accountId: accountId, ticker: ticker },
            { $set: { sharesNumber: newShares, tradeValue: newValue } }
          );
        });
      }
    });
  });
  res.redirect("back");
});

router.get("/posts", (req, res, next) => {
  Post.find()
    .then((dbPosts) => {
      console.log("Posts from the DB: ", dbPosts);
    })
    .catch((err) => {
      console.log(`Err while getting the posts from the DB: ${err}`);
      next(err);
    });
});



module.exports = router;
