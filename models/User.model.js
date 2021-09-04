const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true 
  },
  username: {
    type: String,
    unique: true //-> Ideally, should be unique, but its up to you
  },
  password: String,
});

const User = model("User", userSchema);

module.exports = User;
