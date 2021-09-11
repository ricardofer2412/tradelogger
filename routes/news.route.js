const express = require("express");
const router = express.Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");



router.get('/', isLoggedIn,(req, res, next) => {
    res.render('news/news')
  })


module.exports =  router;