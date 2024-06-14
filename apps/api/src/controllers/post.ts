import Post from "../models/post";
import Comment from "../models/comment";

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (e) {
    next(e);
  }
};

const getPostsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const posts = await Post.find();
    const resPosts = posts.filter((p) => p.category === category);
    if (!resPosts) {
      return res.status(404).json({ msg: "Not posts in this category" });
    }
    res.status(200).json(resPosts);
  } catch (e) {
    next(e);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("category").populate("comments");
    if (!post) {
      return res.stauts(404).json({ mgs: "Post not found" });
    }
    res.status(200).json(post);
  } catch (e) {
    next(e);
  }
};

const createPost = async (req, res, next) => {
  try {
    const posts = await Post.find();
    const duplicate = posts.find((p) => p.title === req.body.title);
    if (duplicate) {
      return res.status(409).json({ msg: "Post name already exists" });
    }
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (e) {
    next(e);
  }
};

const createComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.create(req.body);
    await Post.findByIdAndUpdate(
      id,
      { comments: comment.id },
      {
        new: true,
      }
    );
    res
      .status(201)
      .json(comment);
  } catch (e) {
    next(e);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(200).json(post);
  } catch (e) {
    next(e);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const commentsId = post.comments;
    commentsId.forEach(async (id) => {
      try {
        await Comment.findByIdAndDelete(id);
      } catch (e) {
        next(e);
      }
    });
    const resPost = await Post.findByIdAndDelete(id);
    res.status(204).send(resPost);
  } catch (e) {
    next(e);
  }
};

export default {
  getPosts,
  getPostsByCategory,
  getPostById,
  createPost,
  createComment,
  updatePost,
  deletePost,
};
