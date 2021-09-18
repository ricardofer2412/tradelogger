const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const accountSchema = new Schema({
  accountBalance: Number,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  accountStocks: [{ ticker: String, sharesNumber: Number }],
});

const Account = model("Account", accountSchema);

module.exports = Account;
