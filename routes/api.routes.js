const finnhub = require("finnhub");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = process.env.SESSION_SECRET;
const finnhubClient = new finnhub.DefaultApi();
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const Post = require("../models/Post.model");
const Account = require("../models/Account.model");
const Trade = require("../models/Trade.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");
const { countDocuments, deleteOne } = require("../models/Account.model");

//search for stock
router.get("/quote", isLoggedIn, (req, res, next) => {
  const query = req.query.symbol;
  const stock = query.toUpperCase();
  const user = req.session.currentUser._id;
  const errorMessage = req.query.errorMessage ? req.query.errorMessage : false;

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
              Comment.find({ tickerId: stock }).then((commentFromDb) => {
                const comments = commentFromDb.map((comment) => {
                  comment.userCanEdit =
                    comment.authorId == req.session.currentUser._id;
                  return comment;
            
                });

                
                const accountMoney = account[0].accountBalance;
                const accountId = account[0]._id;
                const accountInfo = account[0];
                Trade.find({
                  ticker: { $eq: stock },
                  accountId: { $eq: accountId },
                }).then((trade) => {
                  let sumBalance = 0;
                  for (let i = 0; i < trade.lenght; i++) {
                    console.log(trade.tradeValue);
                  }
                  const stockTrade = trade[0];
                  res.render("stocks/stocks-info", {
                    candleData,
                    quoteData,
                    companyData,
                    stock,
                    accountMoney,
                    stockTrade,
                    accountInfo,
                    commentFromDb,
                    errorMessage,
                  });
                });
              });
            });
          }
        );
      }
    );
  });
});

////////////////////////////////////////////////////////////////***create a comment****///////////////////////////////////////////
router.post("/comments/:ticker", (req, res) => {
  const time = new Date();
  const newTime = time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  console.log(time);
  const { ticker } = req.params;
  const { content } = req.body;
  const userId = req.session.currentUser._id;
  const userName = req.session.currentUser.username;
  Comment.create({
    tickerId: ticker,
    content,
    authorId: userId,
    userName: userName,
    postTime: newTime,
  })
    .then((response) => {
      res.redirect("back");
    })
    .catch((error) => {
      console.log(error);
    });
});

////////////////////////////////////////////////////////////////***create a comment****//////////////////////////////////////////
router.post("/comments/:ticker", (req, res) => {
  const { ticker } = req.params;
  const { content } = req.body;
  const userId = req.session.currentUser._id;

  Comment.create({ tickerId: ticker, content, authorId: userId })
    .then((response) => {
      res.redirect("back");
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/:commentId/delete", (req, res) => {
  const { commentId } = req.params;

  Comment.findById(commentId).then((comment) => {
    const authorId = comment.authorId;

    if (authorId == req.session.currentUser._id) {
      Comment.findByIdAndDelete(commentId)
        .then(() => res.redirect("back"))
        .catch((error) => next(error));
    } else if (authorId != req.session.currentUser._id) {
      res.redirect("back");
    }
  });
});

/////////////////////////////////////////////////////////UPDATE COMMENT/////////////////////////////////////////
router.get("/:commentId/update", (req, res) => {
  const { commentId } = req.params;
  Comment.findById(commentId)
    .then((userComment) => {
      const authorId = userComment.authorId;
      const ticker = userComment.tickerId;
      if (authorId == req.session.currentUser._id) {
        res.render("comments/update", { comment: userComment });
      } else if (authorId != req.session.currentUser._id) {
        res.redirect("back");
      }
    })
    .catch((error) => next(error));
});

router.post("/:commentId/update", (req, res) => {
  const { commentId } = req.params;
  console.log(commentId);
  const { newContent } = req.body;

  Comment.findByIdAndUpdate(commentId, { content: newContent }).then(
    (comment) => {
      const ticker = comment.tickerId;
      res.redirect(`../quote?symbol=${ticker}`);
    }
  );
});

//fix different account stock buying
router.post("/quote/:ticker", isLoggedIn, (req, res, next) => {
  const { ticker } = req.params;
  const { entryPrice, sharesNumber } = req.body;
  const userId = req.session.currentUser._id;
  const tradeValue = entryPrice * sharesNumber;

  Account.find({ userId: { $eq: userId } }).then((account) => {
    const accountId = account[0]._id;
    const newAccountBalance = account[0].buyingPower - tradeValue;

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
          // console.log(tradeToDB);
          return Account.updateOne(
            { userId: { $eq: userId } },
            { $set: { buyingPower: newAccountBalance.toFixed(2) } }
          );
          console.log("Post to DB");
        });
      } else {
        console.log("Trade exits");

        Trade.findOne({
          accountId: accountId,
          ticker: ticker,
        })
          .then((trade) => {
            console.log(trade);
            const newShares = Number(trade.sharesNumber) + Number(sharesNumber);
            const newValue = Number(trade.tradeValue) + Number(tradeValue);
            return Trade.updateOne(
              { accountId: accountId, ticker: ticker },
              {
                $set: {
                  sharesNumber: newShares,
                  tradeValue: newValue.toFixed(2),
                },
              }
            );
          })
          .then(() => {
            return Account.updateOne(
              { userId: { $eq: userId } },
              { $set: { buyingPower: newAccountBalance.toFixed(2) } }
            );
          });
      }
    });
  });
  res.redirect("back");
});

router.get("/posts", (req, res, next) => {
  Post.find().then((dbPosts) => {
    console.log("Posts from the DB: ", dbPosts);
  });
});

router.post("/quote/:ticker/sell", isLoggedIn, (req, res, next) => {
  const { ticker } = req.params;
  const { entryPrice, sharesNumber } = req.body;
  const userId = req.session.currentUser._id;
  const tradeValue = entryPrice * sharesNumber;
  let errorMessage = false;

  Account.find({ userId: { $eq: userId } }).then((account) => {
    const accountId = account[0]._id;
    Trade.findOne({
      ticker: { $eq: ticker },
      accountId: { $eq: accountId },
    })
      .then((trade) => {
        const tradeId = trade._id;
        console.log(trade);

        // Need some work
        if (sharesNumber > trade.sharesNumber) {
          errorMessage = true;
          //   "Error: You do not have enough stock to sell you worthless piece of garbage!!!";
          // console.log({ error: errorMessage });
          res.redirect(
            `/stock/quote?symbol=${ticker}&errorMessage=Error: You don't own enough shares`
          );
          return;
        } else if (sharesNumber == trade.sharesNumber) {
          console.log("shares are equal");
          Trade.deleteOne({ _id: tradeId }).then(() => {
            const newAccountBalance = account[0].buyingPower + tradeValue;

            return Account.updateOne(
              { userId: { $eq: userId } },
              { $set: { buyingPower: newAccountBalance.toFixed(2) } }
            );
          });
        } else {
          console.log("final loop");
          const newShares = trade.sharesNumber - sharesNumber;
          Account.find({ userId: { $eq: userId } });
          return Trade.updateOne(
            { accountId: accountId, ticker: ticker },
            { $set: { sharesNumber: newShares } }
          );
        }
      })
      .then(() => {
        const newAccountBalance = !errorMessage
          ? account[0].buyingPower + tradeValue
          : account[0].buyingPower;

        return Account.updateOne(
          { userId: { $eq: userId } },
          { $set: { buyingPower: newAccountBalance.toFixed(2) } }
        );
      })
      .then(() => {
        if (!errorMessage) {
          console.log("************* Error message ****************");
          res.redirect("back");
        }
      });
  });
});



module.exports = router;
