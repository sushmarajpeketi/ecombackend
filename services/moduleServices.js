import Module from "../models/ModuleSchema.js";
import dayjs from "dayjs";
import mongoose from "mongoose";
const SORTABLE_MODULES = new Set(["name", "description", "createdAt"]);
export const getDynamicModules = async (data) => {
  const {
    page,
    rows,
    status,
    searchWord,
    from,
    to,
    fetchTotal,
    sort = "createdAt",
    order = "desc",
  } = data;

  const pageNum = Math.max(0, parseInt(page || 0, 10));
  const perPage = Math.max(1, Math.min(100, parseInt(rows || 10, 10)));

  const match = { isDeleted: false };

  if (searchWord && String(searchWord).trim() !== "") {
    const re = new RegExp(String(searchWord).trim(), "i");
    match.$or = [{ name: { $regex: re } }, { description: { $regex: re } }];
  }
  if (status === "true" || status === "false") {
    match.status = status === "true";
  }

  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = dayjs(from).startOf("day").toDate();
    if (to) match.createdAt.$lte = dayjs(to).endOf("day").toDate();
    if (Object.keys(match.createdAt).length === 0) delete match.createdAt;
  }

  const sortField = SORTABLE_MODULES.has(sort) ? sort : "createdAt";
  const sortDir = String(order).toLowerCase() === "asc" ? 1 : -1;
  const sortStage = { [sortField]: sortDir };
  const pipeline = [
    { $match: match },
    { $project: { name: 1, _id: 1, description: 1, createdAt: 1, status: 1 } },
    { $sort: sortStage },
    { $skip: perPage * pageNum },
    { $limit: perPage },
  ];
  const total = fetchTotal === "true" ? await Module.countDocuments(match) : 0;
  const modules = await Module.aggregate(pipeline);
  return { total, modules };
};

export const createModule = async (data) => {
  const payload = { ...data };

  const doc = await Module.create(payload);

  return doc;
};

export const getModules = async () => {
  const doc = await Module.find({});

  return doc;
};

export const getModule = async (id) => {
  const doc = await Module.findOne({ _id: id });

  return doc;
};
export const getModulesNames = async () => {
  const doc = await Module.aggregate([
    { $match: {} },
    { $project: { name: 1, _id: 0 } },
  ]);
  let ans = [];
  doc.forEach((e) => ans.push(e.name));
  return ans;
};

export const getModuleKeys = async()=>{
  const doc = await Module.aggregate([
    { $match: {} },
    { $project: {  _id: 1 } },
  ]);

  return doc;
}

export const updateModule = async (id, updateData) => {
  const updatedModule = await Module.findByIdAndUpdate(id, updateData, {
    new: true,
  }).lean();
  if (!updatedModule) throw new Error("No such module exists");
  return updatedModule;
};

export const deleteModule = async (id) => {
  const doc = await Module.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  ).lean();

  return doc;
};
