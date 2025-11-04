import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../services/categoryServices.js";

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.validatedData;

    const category = await createCategory({ name });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const getAllCategoriesController = async (req, res) => {
  try {
    const { ...query } = req.query;
    const { categories, total } = await getAllCategories(query);
    return res.status(200).json({
      success: true,
      total,
      page: parseInt(req.query.page) || 0,
      rows: parseInt(req.query.rows) || 10,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await updateCategory(name, id);
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updated,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteCategory(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category: deleted,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export {
  createCategoryController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController,
};
