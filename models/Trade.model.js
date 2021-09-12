const { Schema, model } = require("mongoose");

const tradeSchema = new Schema({
  tickerId: String,
  ticker: String,
  entryPrice: Number,
  exitPrice: Number,
  dateAdded: Date,
  dateExited: Date,
  sharesNumber: Number,
  userId: String,
  accountId: String,
  tradeValue: Number,
});

const Trade = model("Trade", tradeSchema);

module.exports = Trade;
