const { Schema, model } = require("mongoose");

const watchlistSchema = new Schema(
  {
    tickerId: { type: String },
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    lastPrice: Number,
  },
  {
    timestamps: true,
  }
);

const Watchlist = model("Watchlist", watchlistSchema);

module.exports = Watchlist;
