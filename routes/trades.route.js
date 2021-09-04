const { reset } = require("nodemon");
const { route } = require(".");
const { routes } = require("../app");
const Trades = require("../models/Trade.model");
const router = require("express").Router();

router.get("/", (req, res, next) => {
  Trades.find().then((responseFromDB) => {
    console.log(responseFromDB);
    res.render("trades/trades", { trades: responseFromDB });
  });
});

router.get("/create", (req, res, next) => {
  res.render("trades/create");
});

router.post("/create", (req, res, next) => {
  console.log(req.body);
  Trades.create(req.body)
    .then((newTrade) => {
      res.redirect("/trades");
    })
    .catch((error) => console.log("err", error));
});

//delete

router.post("/:id/delete", (req, res, next) => {
  console.log(req.params.id);
  Trades.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/trades");
    })
    .catch((error) => {
      console.log("delete", error);
    });
});

module.exports = router;
