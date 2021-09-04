const { Schema, model } = require("mongoose");

const tradeSchema = new Schema({
  ticker: String,
  entryPrice: Number,
  exitPrice: Number,
  dateAdded: Date,
  dateExited: Date,
  sharesBuy: Number,
  sharesSell: Number,
  userId: String,
});

const Trade = model("Trade", tradeSchema);

module.exports = Trade;
