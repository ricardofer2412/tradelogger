const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

/* GET home page */
router.get("/", isLoggedOut, (req, res, next) => {
  res.render("index");
});

router.get("/", isLoggedIn, (req, res, next) => {
  res.render("dashboard/dashboard");
});

router.get("/dashboard", isLoggedIn, (req, res, next) => {
  res.render("dashboard/dashboard");
});

module.exports = router;
