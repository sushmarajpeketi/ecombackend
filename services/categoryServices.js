// services/categoryServices.js
import Category from "../models/CategorySchema.js";
import Product from "../models/ProductSchema.js";
import dayjs from "dayjs";

const createCategory = async ({ name, description, status }) => {
  const newCategory = await Category.create({ name, description, status });
  return newCategory;
};

const updateCategory = async (id, updateData) => {
  const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!updatedCategory) throw new Error("No such category exists");
  return updatedCategory;
};

const deleteCategory = async (id) => {
  const deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory) throw new Error("No such category exists");
  await Product.updateMany({ category: id }, { $pull: { category: id } });
  return deletedCategory;
};

const getAllCategories = async (query) => {
  let { page, rows, name, fetchTotal, createdAt, status, sort, order } = query;

  page = parseInt(page) || 0;
  rows = parseInt(rows) || 10;

  const filter = {};
  if (name) filter.name = { $regex: name, $options: "i" };
  if (createdAt) {
    const start = dayjs(createdAt).startOf("day").toDate();
    const end = dayjs(createdAt).endOf("day").toDate();
    filter.createdAt = { $gte: start, $lte: end };
  }
  if (typeof status !== "undefined") {
    if (status === "true" || status === "1") filter.status = true;
    else if (status === "false" || status === "0") filter.status = false;
  }

  const allowedSorts = { name: "name", description: "description", status: "status", createdAt: "createdAt" };
  const sortField = allowedSorts[sort] || "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;

  const categories = await Category.find(filter, { __v: 0, updatedAt: 0 })
    .collation({ locale: "en", strength: 2 })
    .sort({ [sortField]: sortOrder })
    .skip(page * rows)
    .limit(rows)
    .lean();

  // IMPORTANT: only compute & return total when explicitly requested
  let total;
  if (fetchTotal === "true") {
    total = await Category.countDocuments(filter);
  }

  return { categories, total };
};

const getSingleCategory = async (id) => {
  const category = await Category.findById(id).lean();
  if (!category) throw new Error("Category not found");
  return category;
};

export { createCategory, updateCategory, deleteCategory, getAllCategories, getSingleCategory };
