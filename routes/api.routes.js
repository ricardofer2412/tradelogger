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
  console.log(req.query);
  const stock = query.toUpperCase();
  const user = req.session.currentUser._id;
  console.log(user);


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
              Comment.find({tickerId: stock})
              .then((commentFromDb)=>{
                   // const accountMoney = account[0].accountBalance;
              // console.log("Balance on Account: ", accountMoney);
              res.render("stocks/stocks-info", {
                candleData,
                quoteData,
                companyData,
                stock,
                commentFromDb,
                // accountMoney,
              })
              });
            });
          }
        );
      }
    );
  });
});

  


////////////////////////////////////////////////////////////////***create a comment****///////////////////////////////////////////
router.post('/comments', (req, res) => {
    const {ticker, content} = req.body;
    const userId = req.session.currentUser._id;
    
    Comment.create({tickerId: ticker, content, authorId: userId})
    .then((response) => {
        res.redirect("back")
    }).catch((error) => {console.log(error)})
})

router.post('/:commentId/delete', (req, res) => {
    const {commentId} = req.params;
    
    Comment.findById(commentId).then((comment) => {
      const authorId = comment.authorId;
      
      if(authorId == req.session.currentUser._id){ 
        Comment.findByIdAndDelete(commentId)
         .then(() => res.redirect('back'))
        .catch(error => next(error));
      }else if(authorId != req.session.currentUser._id){
        res.redirect('back')
      }
    })
})

router.get("/:commentId/update", (req, res) => {
  const {commentId} = req.params;
  Comment.findById(commentId)
    .then(userComment => {
      const authorId = userComment.authorId
      const ticker = userComment.tickerId;
      if(authorId == req.session.currentUser._id){
        res.render("comments/update", {comment: userComment})
      }else if(authorId != req.session.currentUser._id){
        res.redirect('back')
      }
    })
    .catch(error => next(error));
})


router.post('/:commentId/update', (req, res)=>{
    const {commentId} = req.params;
    console.log(commentId)
    const {newContent} = req.body;

    Comment.findByIdAndUpdate(commentId, {content: newContent})
    .then((comment)=>{
        const ticker = comment.tickerId;
        res.redirect(`../quote?symbol=${ticker}`)
    })
})


module.exports = router;

