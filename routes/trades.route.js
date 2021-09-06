const { reset } = require("nodemon");
const { route } = require(".");
const { routes, render } = require("../app");
const Trades = require("../models/Trade.model");
const router = require("express").Router();

router.get("/", (req, res, next) => {
  Trades.find().then((responseFromDB) => {
    res.render("trades/trades", { trades: responseFromDB });
  });
});

router.get("/create", (req, res, next) => {
  res.render("trades/create");
});

router.post("/create", (req, res, next) => {
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

router.get("/:id/edit", (req, res, next) => {
  console.log(req.body);
  console.log(req.params.id);
  Trades.findById(req.params.id).then((responseFromDB) => {
    console.log(responseFromDB);
    res.render("trades/edit", responseFromDB);
  });
});

router.post("/:id/edit", (req, res, next) => {
  const { ticker, entryPrice, exitPrce, dateAdded, dateExited } = req.body;
  Trades.findByIdAndUpdate(
    req.params.id,
    { ticker, entryPrice, exitPrce, dateAdded, dateExited },
    { new: true }
  ).then((updateTradeFromDB) => {
    console.log("Updated", updateTradeFromDB);
    res.redirect("/trades");
  });
});

module.exports = router;
