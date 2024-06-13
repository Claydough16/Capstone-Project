const router = require("express").Router();
const Posts = require("../models/post.model");
const Likes = require("../models/likes.model");

//ENDPOINT: Create New Post
router.post("/new", async (req, res) => {
  try {
    const { title, date, description, location, tags } = req.body;

    const post = Posts({
      title,
      date: new Date(),
      description,
      location,
      tags,
    });

    const newPost = await post.save();
    res.status(200).json({
      result: newPost,
    });
  } catch (err) {
    res.status(500).json({
      ERROR: err.message,
    });
  }
});

//ENDPOINT: Get All Posts
router.get("/all", async (req, res) => {
  try {
    const getAllPosts = await Posts.find();
    if (getAllPosts.length > 0) {
      res.status(200).json({
        result: getAllPosts,
      });
    }
  } catch (err) {
    res.status(500).json({
      ERROR: err.message,
    });
  }
});

//ENDPOINT: Get Posts by Tag
router.get("/:tag", async (req, res) => {
  try {
    const { tag } = req.params;
    console.log(tag);
    const getTaggedPost = await Posts.find({ tags: tag });
    res.status(200).json({
      result: getTaggedPost,
    });
  } catch (err) {
    res.status(500).json({
      ERROR: err.message,
    });
  }
});

//ENDPOINT: Update Post
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const info = req.body;

    const patchPost = await Posts.findOneAndUpdate({ _id: id }, info, {
      new: true,
    });
    res.status(200).json({
      message: patchPost,
    });
  } catch (err) {
    res.status(500).json({
      ERROR: err.message,
    });
  }
});

//ENDPOINT: Delete Post
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const delPost = await Posts.deleteOne({ _id: id });

    if (delPost.deletedCount) {
      res.status(200).json({
        message: "removed",
      });
    } else {
      res.send("Message does not exist");
    }
  } catch (err) {
    res.status(500).json({
      ERROR: err.message,
    });
  }
});

// ENDPOINT: Like Post
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const { id: postId } = req.params;

    // Check if the user has already liked the post
    const existingLike = await Likes.findOne({ userId, postId });

    if (existingLike) {
      return res.status(400).json({ message: 'User has already liked the post' });
    }

    // Create a new like document
    const like = new Likes({ userId, postId });
    await like.save();

    res.status(200).json({ message: 'Post liked successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ENDPOINT: Unlike Post
router.delete('/:postId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const { id: postId } = req.params;

    // Delete the like document
    const result = await Likes.findOneAndDelete({ userId, postId });

    if (!result) {
      return res.status(400).json({ message: 'Like not found' });
    }

    res.status(200).json({ message: 'Post unliked successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to get the like status and count
router.post('/status', async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const likeCount = await Likes.countDocuments({ postId });
    const liked = await Likes.exists({ userId, postId });

    res.status(200).json({ liked: !!liked, likeCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;