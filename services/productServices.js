import Product from "../models/ProductSchema.js";
import Category from "../models/CategorySchema.js";
import dayjs from "dayjs";
import mongoose from "mongoose";

const isObjectId = (v) => typeof v === "string" && /^[0-9a-fA-F]{24}$/.test(v);

const resolveCategoryId = async (input) => {
  if (!input) return null;
  if (isObjectId(input)) return new mongoose.Types.ObjectId(input);
  if (typeof input === "string") {
    const cat = await Category.findOne({ name: { $regex: `^${input}$`, $options: "i" } }).lean();
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
  const populated = await Product.findById(doc._id).populate("category", "name").lean();
  return flattenProduct(populated);
};

export const getProductsService = async (query) => {
  let { page, rows, sort, order, fetchTotal } = query;
  const { q, category, from, to, priceMin, priceMax } = query;

  page = parseInt(page) || 0;
  rows = parseInt(rows) || 10;

  const filter = { isDeleted: { $ne: true } };

  if (q && String(q).trim()) {
    const text = String(q).trim();
    const or = [
      { name: { $regex: text, $options: "i" } },
      { description: { $regex: text, $options: "i" } },
    ];
    const rangeMatch = text.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const a = Number(rangeMatch[1]);
      const b = Number(rangeMatch[2]);
      or.push({ price: { $gte: Math.min(a, b), $lte: Math.max(a, b) } });
    } else if (!Number.isNaN(Number(text))) {
      or.push({ price: Number(text) });
    }
    const catByName = await Category.findOne({ name: { $regex: text, $options: "i" } }, { _id: 1 }).lean();
    if (catByName?._id) or.push({ category: catByName._id });
    filter.$or = or;
  }

  if (category && String(category).trim()) {
    try {
      const catId = await resolveCategoryId(String(category).trim());
      filter.category = catId;
    } catch {
      return { data: [], total: 0, page, rows };
    }
  }

  if (from || to) {
    const start = from && dayjs(from).isValid() ? dayjs(from).startOf("day").toDate() : undefined;
    const end = to && dayjs(to).isValid() ? dayjs(to).endOf("day").toDate() : undefined;
    filter.createdAt = {
      ...(start ? { $gte: start } : {}),
      ...(end ? { $lte: end } : {}),
    };
  }

  const min = Number(priceMin);
  const max = Number(priceMax);
  if (!Number.isNaN(min)) filter.price = { ...(filter.price || {}), $gte: min };
  if (!Number.isNaN(max)) filter.price = { ...(filter.price || {}), $lte: max };

  const allowed = { name: 1, price: 1, createdAt: 1 };
  const sortField = allowed[sort] ? sort : "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;

  const total = fetchTotal ? await Product.countDocuments(filter) : undefined;

  const data = await Product.find(filter)
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
  const updated = await Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
    .populate("category", "name")
    .lean();
  return flattenProduct(updated);
};

export const deleteProductService = async (id) => {
  const res = await Product.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true }).lean();
  return res;
};

export const uploadProductImageService = async (file) => {
  if (!file) throw new Error("No file uploaded");
  return file.path;
};
