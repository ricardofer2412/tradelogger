const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const Post = require("../models/Post.model");
const Account = require("../models/Account.model");
const Watchlist = require("../models/Watchlist.model");
const bcrypt = require("bcryptjs");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("user/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { firstName, lastName, email, username, password } = req.body;

  if (!firstName || !lastName || !email || !username || !password) {
    res.render("user/signup", {
      errorMessage: "Please fill out all required fields",
    });
  } else {
    User.findOne({ username }).then((user) => {
      if (!user) {
        User.findOne({ email }).then((response) => {
          if (!response) {
            const hashedPassword = bcrypt.hashSync(password, 10);

            User.create({
              firstName,
              lastName,
              email,
              username,
              password: hashedPassword,
            }).then((createdUser) => {
              const userId = createdUser._id;
              Account.create({
                buyingPower: 100000,
                accountBalance: 100000,
                userId: userId,
              }).then((account) => {
                return User.findByIdAndUpdate(userId, {
                  accountId: account._id,
                }).then(() => {
                  res.redirect("/dashboard");
                });
              });
            });
          } else {
            res.status(500).render("user/signup", {
              errorMessage:
                "This email is already being used, please try a different one or login.",
            });
          }
        });
      } else {
        res.status(500).render("user/signup", {
          errorMessage:
            "This username is already being used, please try a different one.",
        });
      }
    });
  }
});

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("user/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
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

router.get("/dashboard", isLoggedIn, (req, res, next) => {});

router.post("/dashboard/add/:ticker", isLoggedIn, (req, res, next) => {
  const { ticker } = req.params;
  const author = req.session.currentUser._id;
  console.log(ticker, author);
  Watchlist.create({ tickerId: ticker, authorId: author }).then(
    (newWatchlist) => {
      console.log(newWatchlist);
      res.redirect("back");
    }
  );

  // User.findById(req.session.currentUser).then((user) => {
  //   if(user.watchList.includes(ticker)) {
  //     console.log('this ticker is on watchList')
  //   }else {
  //   User.findByIdAndUpdate({_id: req.session.currentUser._id},
  //                             {$push: {watchList: ticker}})
  //   .then((thisUser) => {
  //     console.log('this is updated watchlist', thisUser)
  //     res.redirect('back')
  //   })
  //   }
  // })
});
router.post("/dashboard/remove/:id", (req, res) => {
  const { id } = req.params;
  console.log("id", id);

  Watchlist.findByIdAndDelete(id).then(() => {
    console.log("Ticker remove from Watchlist");
    res.redirect("back");
  });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("user/profile", { userInSession: req.session.currentUser });
});

module.exports = router;
