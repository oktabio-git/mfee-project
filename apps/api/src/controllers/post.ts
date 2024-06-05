const posts = [];
const comments = [];

const getPosts = (req, res) => {
  res.status(200).json(posts);
};

const getPostsByCategory = (req, res) => {
  const { category } = req.params;
  const resPosts = posts.find((p) => p.category === category);
  if (!resPosts) {
    return res.status(404).json({ msg: "Not posts in this category" });
  }
  res.status(200).json(resPosts);
};

const getPostById = (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);
  if (!post) {
    return res.stauts(404).json({ mgs: "Post not found" });
  }
  res.status(200).json(post);
};

const createPost = (req, res) => {
  const { title, image, description, category, comments } = req.body;
  if (!title) {
    return res.status(400).json({ msg: "Title is required" });
  }
  const newPost = {
    id: Date.now().toString(),
    title,
    image,
    description,
    category,
    comments,
  };
  posts.push(newPost);
  res.status(201).json(newPost);
};

const createComment = (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;
  if (!content) {
    return res.status(400).json({ msg: "Content is required" });
  }
  const newComment = {
    id: Date.now().toString(),
    author,
    content,
  };
  comments.push(newComment);
  const post = posts.find((p) => p.id === id);
  post.comments.push(newComment.id);
  return res.status(201).json(newComment);
};

const updatePost = (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex((p) => p.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ msg: "Post not found" });
  }
  const updatedPost = { ...posts[postIndex] };
  const { title } = req.body;
  if (title) {
    updatedPost.title = title;
  }
  posts[postIndex] = updatedPost;
  res.status(200).send(updatedPost);
};

const deletePost = (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex((p) => p.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ msg: "Post not found" });
  }
  posts.splice(postIndex, 1);
  res.status(204).send();
};

export default {
    getPosts,
    getPostsByCategory,
    getPostById,
    createPost,
    createComment,
    updatePost,
    deletePost
}