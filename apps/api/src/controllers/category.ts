const categories = [];

const getCategories = (req, res) => {
  res.status(200).json(categories);
};

const getCategoryById = (req, res) => {
  const { id } = req.params;
  const category = categories.find((c) => c.id === id);
  if (!category) {
    return res.status(404).json({ msg: "Category not found" });
  }
  res.status(200).json(category);
};

const createCategory = (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ msg: "Name is required" });
  }
  const newCategory = {
    id: Date.now().toString(),
    name,
  };
  categories.push(newCategory);
  res.status(201).json(newCategory);
};

const updateCategory = (req, res) => {
  const { id } = req.params;
  const categoryIndex = categories.findIndex((p) => p.id === id);
  if (categoryIndex === -1) {
    return res.status(404).json({ msg: "Category not found" });
  }
  const updatedCategory = { ...categories[categoryIndex] };
  const { name } = req.body;
  if (name) {
    updatedCategory.name = name;
  }
  categories[categoryIndex] = updatedCategory;
  res.status(200).send(updatedCategory);
};

const deleteCategory = (req, res) => {
  const { id } = req.params;
  const categoryIndex = categories.findIndex((p) => p.id === id);
  if (categoryIndex === -1) {
    return res.status(404).json({ msg: "Category not found" });
  }
  categories.splice(categoryIndex, 1);
  res.status(204).send();
};

export default {
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createCategory,
};
