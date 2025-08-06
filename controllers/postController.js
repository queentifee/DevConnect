const Post = require("../models/Post");
const User = require("../models/Users");



// POST /post - Create a new post
exports.createPost = async (req, res) => {
  try {
    const { user, content, images } = req.body;
    if (!user || !content) {
      return res.status(400).json({ message: "User, and content are required." });
    }

    // Optional: Check if user exists
    const userDoc = await User.findById(user);
    if (!userDoc) {
      return res.status(404).json({ message: "User not found." });
    }

    const post = new Post({
      user,
      content,
      images: images || [],
    });

    const savedPost = await post.save();

    userDoc.post.push(savedPost._id);
    await userDoc.save();
    res.status(201).json({
        message: "Post created successfully",
        post: savedPost
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create post.", error: error.message });
  }
};

exports.getPostsByUserId = async (req, res) => {
  try {
    const { Id } = req.params;
    const posts = await Post.find({ user: Id }).sort({ createdAt: -1 });
 res.status(200).json({ 
        message: "Posts retrieved successfully",
        posts
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts.", error: error.message });
  }
};

// GET /:id - Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json({ 
        message: "Post retrieved successfully",
        post
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch post.", error: error.message });
  }
};

// PUT /:id - Update a post by ID
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, images } = req.body;
    const updated = await Post.findByIdAndUpdate(
      id,
      { content, images, updatedAt: Date.now() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json({
      message: "Post updated successfully",
      post: updated
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update post.", error: error.message });
  }
};

// DELETE /:id - Delete a post by ID
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Post not found." });
    }
    // Optionally remove post from user's post array
    await User.updateOne({ post: id }, { $pull: { post: id } });
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post.", error: error.message });
  }
};
