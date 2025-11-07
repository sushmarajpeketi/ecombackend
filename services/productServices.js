import Product from "../models/ProductSchema.js";
import dayjs from "dayjs";

export const createProductService = async (data) => {
  const newProduct = await Product.create(data);
  return newProduct;
};

export const getProductsService = async (query) => {
  let { page, rows, name, createdAt, priceMin, priceMax, fetchTotal, sort, order } = query;

  page = parseInt(page) || 0;
  rows = parseInt(rows) || 10;

  const q = {};
  if (name) q.name = { $regex: new RegExp(name, "i") };
  if (createdAt && dayjs(createdAt).isValid()) {
    const start = dayjs(createdAt).startOf("day").toDate();
    const end = dayjs(createdAt).endOf("day").toDate();
    q.createdAt = { $gte: start, $lte: end };
  }

  const min = Number(priceMin);
  const max = Number(priceMax);
  if (!Number.isNaN(min)) q.price = { ...(q.price || {}), $gte: min };
  if (!Number.isNaN(max)) q.price = { ...(q.price || {}), $lte: max };

  const allowed = { name: 1, price: 1, createdAt: 1 };
  const sortField = allowed[sort] ? sort : "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;

  const total = fetchTotal ? await Product.countDocuments(q) : undefined;
  const data = await Product.find(q).sort({ [sortField]: sortOrder }).skip(page * rows).limit(rows);

  return { data, total, page, rows };
};

export const getSingleProductService = async (id) => {
  return await Product.findById(id);
};

export const updateProductService = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProductService = async (id) => {
  return await Product.findByIdAndDelete(id);
};

export const uploadProductImageService = async (file) => {
  if (!file) throw new Error("No file uploaded");
  return file.path;
};
