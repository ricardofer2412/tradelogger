const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");
const Account = require("../models/Account.model");
const finnhub = require("finnhub");

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
    finnhubClient.marketNews("general", {}, (error, data, response) => {
      const news = data;
      const accountInfo = account[0];
      res.render("dashboard/dashboard", { accountInfo, news });
    });
  });
});

module.exports = router;
