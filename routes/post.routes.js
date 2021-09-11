// const express = require("express");
// const router = express.Router();
// const User = require('../models/User.model')
// const Comment = require('../models/Comment.model')
// const Post = require('../models/Post.model')

// const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");




// // router.get('/create', isLoggedIn, (req, res, next) => {
// //     res.render('posts/create')
// //   })
  


// // router.post('/create', isLoggedIn, (req, res, next) =>{
// //     const {stock, content, author} = req.body;
  
// //     Post.create({title,content,author})
// //     .then(dbPost =>{
// //         return User.findByIdAndUpdate(author, { $push:{ posts: dbPost._id } })
// //     })
// //     .then(()=>{
// //         res.redirect(`/stock/quote?symbol=${stock}`);
// //     })
// //     .catch(err => {
// //         console.log(`Err while creating the post in the DB: ${err}`);
// //         next(err);
// //     });
  
// //   });

//   module.exports = router;