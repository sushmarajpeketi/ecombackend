import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getSingleCategory
} from "../services/categoryServices.js";

const createCategoryController = async (req, res) => {
  try {
    const { name, description, status } = req.validatedData;
    const category = await createCategory({ name, description, status });
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllCategoriesController = async (req, res) => {
  try {
    const query = req.query;
    const { categories, total } = await getAllCategories(query);
    return res.status(200).json({
      success: true,
      total,
      page: parseInt(req.query.page) || 0,
      rows: parseInt(req.query.rows) || 10,
      data: categories,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.validatedData;
    const updated = await updateCategory(id, updateData);
    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteCategory(id);
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deleted,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getSingleCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await getSingleCategory(id);
    return res.status(200).json({ success: true, data: category });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

export {
  createCategoryController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController,
  getSingleCategoryController
};
