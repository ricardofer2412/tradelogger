const { Schema, model } = require("mongoose");

const accountSchema = new Schema({
  accountBalance: Number,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const Account = model("Account", accountSchema);

module.exports = Account;
