const { Schema, model } = require("mongoose");

const accountSchema = new Schema({
  accountBalance: Number,
  userId: String,
});

const Account = model("Account", accountSchema);

module.exports = Account;
