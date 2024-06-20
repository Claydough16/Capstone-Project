const router = require("express").Router();
const Posts = require("../models/post.model");
const Like = require("../models/like.model");

//ENDPOINT: Create New Post
router.post("/new", async (req, res) => {
  try {
    const { title, date, description, location, tags, likes, eventDate } =
      req.body;

    const post = Posts({
      title,
      date: new Date(),
      description,
      location,
      tags,
      eventDate,
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
router.patch("/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Check if the post exists
    const post = await Posts.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ user: userId, post: id });
    if (existingLike) {
      return res
        .status(400)
        .json({ message: "User has already liked the post" });
    }

    // Create a new like associated with the user
    const newLike = new Like({ user: userId, post: id }); // still not working
    await newLike.save();

    // Update likes count in the post document
    post.likesCount += 1;
    await post.save();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (err) {
    res.status(500).json({ ERROR: err.message });
  }
});

// ENDPOINT: Unlike Post
router.patch("/:id/unlike", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Find and delete the like
    await Like.findOneAndDelete({ user: userId, post: id });

    // Update likes count in the post document
    const post = await Posts.findById(id);
    if (post.likesCount > 0) {
      post.likesCount -= 1;
      await post.save();
    }

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (err) {
    res.status(500).json({ ERROR: err.message });
  }
});
// ENDPOINT: Get Like Status and Count
router.post("/status", async (req, res) => {
  try {
    const { postId, userId } = req.body;

    // Check if the user has liked the post
    const liked = await Like.exists({ user: userId, post: postId });

    // Get the total like count for the post
    const likeCount = await Like.countDocuments({ post: postId });

    res.status(200).json({ likeCount, liked });
  } catch (err) {
    res.status(500).json({ ERROR: err.message });
  }
});

module.exports = router;
