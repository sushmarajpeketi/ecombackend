import Product from "../models/ProductSchema.js";
import Category from "../models/CategorySchema.js";
import dayjs from "dayjs";

export const createProductService = async (data) => {
  const { category } = data;

  if (!category || !Array.isArray(category) || category.length === 0) {
    throw new Error("At least one category name is required");
  }

  const categories = await Category.find({
    name: { $in: category.map((name) => name.trim()) },
  });

  if (categories.length !== category.length) {
    throw new Error("One or more category names do not exist");
  }

  const categoryIds = categories.map((cat) => cat._id);

  const newProduct = await Product.create({
    ...data,
    category: categoryIds,
  });

  return newProduct;
};

export const getProductsService = async (query) => {
  let { page, rows, name, category, fetchTotal, createdAt } = query;
  console.log("query", query);
  page = parseInt(page) || 0;
  rows = parseInt(rows) || 10;

  const filter = {};

  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }

  if (category) {
    const categoryDoc = await Category.findOne({ name: category.trim() });

    if (categoryDoc) {
      filter.category = { $in: [categoryDoc._id] };
    } else {
      filter.category = { $in: [] };
    }
  }
  console.log("filter is", filter);
  if (createdAt) {
    const start = dayjs(createdAt).startOf("day").toDate();
    const end = dayjs(createdAt).endOf("day").toDate();
    filter.createdAt = { $gte: start, $lte: end };
  }

  const products = await Product.find(filter, { __v: 0 })
    .populate("category", "name")
    .skip(page * rows)
    .limit(rows)
    .lean();

  let total = 0;
  if (fetchTotal === "true") {
    total = await Product.countDocuments(filter);
  }

  return { products, total };
};

export const getSingleProductService = async (id) => {
  return await Product.findById(id).select("-__v").populate("category", "name");
};

export const updateProductService = async (id, updates) => {
  if (updates.category && Array.isArray(updates.category)) {
    const categoryNames = updates.category;
    const foundCategories = await Category.find({
      name: { $in: categoryNames },
    });

    if (foundCategories.length !== categoryNames.length) {
      const foundNames = foundCategories.map((c) => c.name);
      const missing = categoryNames.filter((n) => !foundNames.includes(n));

      throw new Error(`Category not found: ${missing.join(", ")}`);
    }
    updates.category = foundCategories.map((c) => c._id);
  }

  const updated = await Product.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, projection: { __v: 0 } }
  ).populate("category", "name");

  return updated;
};

export const deleteProductService = async (id) => {
  return await Product.findByIdAndDelete(id);
};

export const uploadImageService = async (file) => {
  if (!file) throw new Error("No file uploaded");
  return file.path;
};
