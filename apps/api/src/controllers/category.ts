import Category from "../models/category";

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (e) {
    next(e);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.status(200).json(category);
  } catch (e) {
    next(e);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const categories = await Category.find();
    const duplicate = categories.find((c) => c.name === req.body.name);
    if (duplicate) {
      return res.status(409).json({ msg: "Category already exists" });
    }
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (e) {
    next(e);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.status(200).json(category);
  } catch (e) {
    next(e);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }
    res.status(204).send(category);
  } catch (e) {
    next(e);
  }
};

export default {
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createCategory,
};
