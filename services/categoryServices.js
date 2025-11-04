import Category from "../models/CategorySchema.js";
import Product from "../models/ProductSchema.js";

const createCategory = async ({ name }) => {
  const newCategory = await Category.create({ name });
  return newCategory;
};

const updateCategory = async (name, id ) => {

  let updatedCategory = await Category.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
  if (!updatedCategory) {
    throw new Error("No such category exists");
  }

  return updatedCategory;
};

const deleteCategory = async (id) => {
  let deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory) {
    throw new Error("No such category exists");
  }
  
  let deleted = await Product.updateMany({ category: id }, { $pull: { category: id } });
  return deleted;
};

const getAllCategories = async (query) => {
  let { page, rows, name, fetchTotal, createdAt } = query;
  page = parseInt(page) || 0;
  rows = parseInt(rows) || 10;

  const filter = {};

  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }
  if (createdAt) {
    const start = dayjs(createdAt).startOf("day").toDate();
    const end = dayjs(createdAt).endOf("day").toDate();
    filter.createdAt = { $gte: start, $lte: end };
  }
  let categories = await Category.find(filter, {
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  })
    .skip(page * rows)
    .limit(rows)
    .lean();
  let total = 0;
  if (fetchTotal === "true") {
    total = await Category.countDocuments(filter);
  }
  return { categories, total };
};

export { createCategory, updateCategory, deleteCategory, getAllCategories };
