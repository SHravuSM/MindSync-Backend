const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const verifyToken = require("../middlewares/verifyToken");

router.use(verifyToken);

// Delete User
router.delete("/user", async (req, res) => {
  console.log(req.user);
});

// Create new post
router.post("/", async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Post creation failed", error: err });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to get posts", error: err });
  }
});

// Like / Unlike a post
router.patch("/like/:id", async (req, res) => {
  try {
    const { uid } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(uid);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id !== uid);
    } else {
      post.likes.push(uid);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Like failed", error: err });
  }
});

// Comment on a post
router.post("/comment/:id", async (req, res) => {
  try {
    const { uid, name, photo, comment } = req.body;
    const post = await Post.findById(req.params.id);

    post.comments.push({ uid, name, photo, comment });
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Comment failed", error: err });
  }
});

module.exports = router;
