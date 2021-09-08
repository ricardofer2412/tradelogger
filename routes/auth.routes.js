const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("user/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { firstName, lastName, email, username, password } = req.body;

    if(!firstName || !lastName || !email || !username || !password){
        res.render('user/signup', {
        errorMessage: "Please fill out all required fields"
        })
    }else{
       User.findOne({username}).then(user =>{
            console.log("user from db", username , email);
            if(!user){
            const hashedPassword = bcrypt.hashSync(password, 10)
             User.create({
                firstName,
                lastName,
                email,
                username,
                password: hashedPassword
                
            }).then(createdUser =>{
                req.session.currentUser = createdUser;
            res.redirect('/dashboard');
            })
        }
       })
    }
})

router.get('/login', isLoggedOut, (req, res, next) =>{
    res.render('user/login')
})

router.post('/login', isLoggedOut, (req, res, next) =>{
    console.log('SESSION ======>', req.session)
    const {username, password} = req.body;
    if(!username || !password){
        res.render('user/login', {
            errorMessage: "Please enter both username and password"
        });
      }
    });
  }
});

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("user/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  console.log("SESSION ======>", req.session);
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("user/login", {
      errorMessage: "Please enter both username and password",
    });
  } else {
    User.findOne({ username }).then((userFromDB) => {
      if (!userFromDB) {
        res.status(500).render("user/login", {
          errorMessage:
            "We could not find you! Would you like to create an account?",
        });
      } else if (bcrypt.compareSync(password, userFromDB.password)) {
        req.session.currentUser = userFromDB;
        res.status(200).redirect("/dashboard");
      } else {
        res
          .status(500)
          .render("user/login", { errorMessage: "Incorrect Log In data" });
      }
    });
  }
});

//this is logout routes

//this is logout routes

router.post('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
        if(err) next(err);
        res.redirect('/');
    })
})

router.get("/profile", isLoggedIn, (req, res, next) => {
  console.log("user in session:", { userInSession: req.session.currentUser });
  res.render("user/profile", { userInSession: req.session.currentUser });
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
