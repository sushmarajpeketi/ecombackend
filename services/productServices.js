import Product from "../models/ProductSchema.js";
import dayjs from "dayjs";

// Create product
export const createProductService = async (data) => {
  const newProduct = await Product.create(data);
  return newProduct;
};

// Get products with filtering
export const getProductsService = async (query) => {
  let { page, rows, name, category, fetchTotal, createdAt } = query;

  page = parseInt(page) || 0;
  rows = parseInt(rows) || 10;

  const filter = {};

  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }

  if (category) {
    filter.category = { $regex: category, $options: "i" }; 
  }

  if (createdAt) {
    const start = dayjs(createdAt).startOf("day").toDate();
    const end = dayjs(createdAt).endOf("day").toDate();
    filter.createdAt = { $gte: start, $lte: end };
  }

  const products = await Product.find(filter, { __v: 0, updatedAt: 0 })
    .skip(page * rows)
    .limit(rows)
    .lean();

  let total = 0;
  if (fetchTotal === "true") {
    total = await Product.countDocuments(filter);
  }

  return { products, total };
};

// Get single product
export const getSingleProductService = async (id) => {
  return await Product.findById(id).select("-__v");
};

// Update product
export const updateProductService = async (id, updates) => {
  const updated = await Product.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, projection: { __v: 0 } }
  );

  return updated;
};

// Delete product
export const deleteProductService = async (id) => {
  return await Product.findByIdAndDelete(id);
};

// Upload image
export const uploadProductImageService = async (file) => {
  if (!file) throw new Error("No file uploaded");
  return file.path;
};
