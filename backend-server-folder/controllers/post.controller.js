const router = require("express").Router();
const Posts = require("../models/post.model");

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
module.exports = router;
