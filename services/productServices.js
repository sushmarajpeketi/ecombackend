import Product from "../models/ProductSchema.js";
import Category from "../models/CategorySchema.js";
import dayjs from "dayjs";
import mongoose from "mongoose";

const isObjectId = (v) => typeof v === "string" && /^[0-9a-fA-F]{24}$/.test(v);

const resolveCategoryId = async (input) => {
  if (!input) return null;
  if (isObjectId(input)) return new mongoose.Types.ObjectId(input);
  if (typeof input === "string") {
    const cat = await Category.findOne({
      name: { $regex: `^${input}$`, $options: "i" },
    }).lean();
    if (!cat) throw new Error(`Category "${input}" not found`);
    return cat._id;
  }
  if (typeof input === "object" && input._id) return input._id;
  throw new Error("Invalid category");
};

const flattenProduct = (p) => {
  if (!p) return p;
  const { category, ...rest } = p;
  return { ...rest, category: category?.name ?? null };
};

export const createProductService = async (data) => {
  const payload = { ...data };
  if (payload.category !== undefined) {
    payload.category = await resolveCategoryId(payload.category);
  }
  const doc = await Product.create(payload);
  const populated = await Product.findById(doc._id)
    .populate("category", "name")
    .lean();
  return flattenProduct(populated);
};

export const getProductsService = async (query) => {
  let {
    page,
    rows,
    name,
    createdAt,
    priceMin,
    priceMax,
    fetchTotal,
    sort,
    order,
  } = query;

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

  const data = await Product.find(q)
    .sort({ [sortField]: sortOrder })
    .skip(page * rows)
    .limit(rows)
    .populate("category", "name")
    .lean();

  return {
    data: data.map(flattenProduct),
    total,
    page,
    rows,
  };
};

export const getSingleProductService = async (id) => {
  const prod = await Product.findById(id).populate("category", "name").lean();
  return flattenProduct(prod);
};

export const updateProductService = async (id, data) => {
  const payload = { ...data };
  if (payload.category !== undefined) {
    payload.category = await resolveCategoryId(payload.category);
  }
  const updated = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate("category", "name")
    .lean();
  return flattenProduct(updated);
};

export const deleteProductService = async (id) => {
  return await Product.findByIdAndDelete(id);
};

export const uploadProductImageService = async (file) => {
  if (!file) throw new Error("No file uploaded");
  return file.path;
};
