const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  name: String,
  email: String,
  role: { type: String, required: true },
  posts: Number,
  photo: String,
});

module.exports = mongoose.model("user", userSchema);
