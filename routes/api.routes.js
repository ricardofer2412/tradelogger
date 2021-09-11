const finnhub = require("finnhub");
const express = require("express");
const router = express.Router(); 
const axios = require('axios');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "c4psplqad3icgcuepmdg"
const finnhubClient = new finnhub.DefaultApi()
const User = require('../models/User.model')
const Comment = require('../models/Comment.model')
const Post = require('../models/Post.model')
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

//search for stock
router.get("/quote", isLoggedIn, (req, res, next) => {
  const query = req.query.symbol;
  const stock = query.toUpperCase();

finnhubClient.quote(`${stock}`, (error, quoteData, response) => {
    finnhubClient.companyProfile2({'symbol': stock}, (error, companyData, response) => {
        finnhubClient.stockCandles(stock, "D", 1590988249, 1591852249, (error, candleData, response) => {
            console.log(candleData)  
            res.render('stocks/stocks-info', {candleData, quoteData, companyData, stock});
            
          });
      
    })
  })
  
})

  

router.post('/post-create', isLoggedIn, (req, res, next) =>{
    const {stock, content, author} = req.body;

    Post.create({title,content,author})
    .then(dbPost =>{
        return User.findByIdAndUpdate(author, { $push:{ posts: dbPost._id } })
    })
    .then(()=>{
        res.redirect(`/stock/quote?symbol=${stock}`);
    })
    .catch(err => {
        console.log(`Err while creating the post in the DB: ${err}`);
        next(err);
    });
  
});

router.get('/posts', (req, res, next) => {
    Post.find()
      .then(dbPosts => {
        console.log('Posts from the DB: ', dbPosts);
      })
      .catch(err => {
        console.log(`Err while getting the posts from the DB: ${err}`);
        next(err);
      });
  });




module.exports = router;
