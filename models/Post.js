const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 280,
  },
  user: {
    email: String,
    name: String,
    photo: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: [String], // user.uid array
    default: [],
  },
  comments: [
    {
      uid: String,
      name: String,
      photo: String,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  tags: {
    type: [String], // array of tags like ['tech', 'life', 'fun']
    default: [],
  },
});

module.exports = mongoose.model("post", postSchema);
