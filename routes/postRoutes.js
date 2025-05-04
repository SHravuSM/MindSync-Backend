const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const verifyToken = require("../middlewares/verifyToken");
const { findByIdAndDelete } = require("../models/User");
const User = require("../models/User");

router.use(verifyToken);

router.delete("/user", async (req, res) => {
  try {
    const userId = req.user.uid;
    console.log("User ID:", req.user);

    // 1️⃣ Delete the user profile
    const deletedUser = await User.findOneAndDelete({ uid: userId });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // 2️⃣ Delete all posts created by this user
    const deletedPosts = await Post.deleteMany({ "user.name": req.user.name });

    // 3️⃣ Remove user's likes from all posts
    await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });

    // 4️⃣ Remove user's comments from all posts
    await Post.updateMany(
      { "comments.uid": userId },
      { $pull: { comments: { uid: userId } } }
    );

    console.log("Deleted user:", deletedUser);
    console.log("Deleted posts:", deletedPosts.deletedCount);

    res.status(200).json({
      message: "User and all associated data deleted successfully.",
      user: deletedUser,
      deletedPosts: deletedPosts.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting user and associated data:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
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
    console.log(req.user);
    const posts = await Post.find().sort({
      createdAt: -1,
    });
    console.log(posts);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to get posts", error: err });
  }
});

router.get("/me", async (req, res) => {
  try {
    console.log(req.user);
    const posts = await Post.find({ "user.email": req.user.email }).sort({
      createdAt: -1,
    });
    console.log(posts);
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
    console.log(req.body);
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
