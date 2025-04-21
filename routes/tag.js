const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const verifyToken = require("../middlewares/verifyToken");

router.use(verifyToken);

// Route: GET /tags/all
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find(
      { tags: { $exists: true, $ne: [] } },
      { tags: 1, _id: 0 }
    );

    const allTags = posts.flatMap((post) => post.tags);
    const uniqueTags = [...new Set(allTags)];

    res.status(200).json(uniqueTags);
  } catch (err) {
    console.error("Error fetching all tags:", err);
    res.status(500).json({ message: "Failed to fetch tags", error: err });
  }
});

router.get("/:tag", async (req, res) => {
  try {
    const tag = "#" + req.params.tag; // Only if tags are saved with '#'
    console.log("Requested tag:", tag);

    // Fetch posts that have 'tag' in the tags array
    const posts = await Post.find({ tags: tag }).sort({ createdAt: -1 });

    console.log("Found posts:", posts.length);
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts by tag:", err);
    res.status(500).json({ message: "Failed to get posts", error: err });
  }
});

module.exports = router;
