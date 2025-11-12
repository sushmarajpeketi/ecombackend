import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/UserSchema.js";
import Role from "../models/RoleSchema.js";

const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;
const isObjectId = (v) => typeof v === "string" && /^[0-9a-fA-F]{24}$/.test(v);

const resolveRoleId = async (input) => {
  if (!input) return null;

  if (isObjectId(input)) return new mongoose.Types.ObjectId(input);

  if (typeof input === "string") {
    const roleDoc = await Role.findOne({
      name: { $regex: `^${input}$`, $options: "i" },
    }).lean();
    if (!roleDoc) throw new Error(`Role "${input}" not found`);
    return roleDoc._id;
  }

  if (typeof input === "object" && input._id) return input._id;

  throw new Error("Invalid role");
};

const createCustomer = async (data) => {
  const { username, email, password, mobile, image } = data;

  const existingUser = await User.findOne({ email, isDeleted: false });
  if (existingUser) throw new Error("EMAIL EXISTS");

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const fallbackRole = await Role.findOne({
    name: { $regex: "^user$", $options: "i" },
  }).lean();
  if (!fallbackRole) throw new Error("Fallback role not found");

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    mobile,
    image,
    role: fallbackRole._id,
    isDeleted: false,
  });

  return user;
};

const createUser = async (data) => {
  const { username, email, password, mobile, image, role, status } = data;

  const existingUser = await User.findOne({ email, isDeleted: false });
  if (existingUser) throw new Error("EMAIL EXISTS");

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  let roleId;
  if (role) roleId = await resolveRoleId(role);
  else {
    const fallbackRole = await Role.findOne({
      name: { $regex: "^user$", $options: "i" },
    }).lean();
    if (!fallbackRole) throw new Error("Fallback role not found");
    roleId = fallbackRole._id;
  }

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    mobile,
    image,
    role: roleId,
    status: typeof status === "boolean" ? status : true,
    isDeleted: false,
  });

  return user;
};

const loginUser = async (data) => {
  const { email, password } = data;


  const inactiveUser = await User.findOne({ email, status: false ,isDeleted:false})
    .populate("role", "name")
    .lean();
 
  if (inactiveUser) throw new Error("user is not active!");


  const deletedUser = await User.findOne({
    email,
    isDeleted: true,
   
  })
    .populate("role", "name")
    .lean();

  if (deletedUser) throw new Error("user is deleted, email already registered and deleted!");
  
  const user = await User.findOne({ email}).populate("role","name").lean()
  if(!user) throw new Error("user not found!")

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Error("Invalid password");

  const payload = {
    id: user._id,
    username: user.username,
    email,
    role: user.role?.name,
  };

  const token = jwt.sign(payload, process.env.SECRETKEY, { expiresIn: "1h" });
  if (!token) throw new Error("JWT Error");

  return { token, user };
};

const getAllUsers = async () => {
  const users = await User.find({ isDeleted: false })
    .select("username email mobile image role status")
    .populate("role", "name")
    .lean();

  if (!users || users.length === 0) throw new Error("No users found");

  return users;
};

const getDynamicUsers = async (rows, skip, length, searchWord, from, to) => {
  const limit = Math.max(0, Number(rows) || 0);
  const offset = Math.max(0, Number(skip) || 0);
  const includeTotal = Boolean(length);

  const q = typeof searchWord === "string" ? searchWord.trim() : "";
  const createdAtFilter = {};
  if (from) createdAtFilter.$gte = new Date(from);
  if (to) createdAtFilter.$lte = new Date(to);

  const dateStage =
    createdAtFilter.$gte || createdAtFilter.$lte
      ? [{ $match: { createdAt: createdAtFilter } }]
      : [];
  const base = [
    { $match: { isDeleted: false } },
    ...dateStage,
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "roleDoc",
      },
    },
    { $unwind: { path: "$roleDoc", preserveNullAndEmptyArrays: true } },
    ...(q
      ? [
          {
            $match: {
              $or: [
                { username: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
                { "roleDoc.name": { $regex: q, $options: "i" } },
                {
                  $expr: {
                    $regexMatch: {
                      input: { $toString: "$mobile" },
                      regex: q,
                      options: "i",
                    },
                  },
                },
              ],
            },
          },
        ]
      : []),
  ];

  let pipeline;

  if (includeTotal) {
    pipeline = [
      ...base,

      {
        $facet: {
          total: [{ $count: "value" }],
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: offset },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                username: 1,
                email: 1,
                mobile: 1,
                role: "$roleDoc.name",
                status: 1,
                createdAt:1
              },
            },
          ],
        },
      },
      {
        $project: {
          data: 1,
          total: { $ifNull: [{ $first: "$total.value" }, 0] },
        },
      },
    ];

    const agg = await User.aggregate(pipeline);
    const first = agg[0] || { data: [], total: 0 };
    const users = first.data.map((u) => {
      const { _id, ...rest } = u;
      return { id: String(_id), ...rest };
    });
    return { users, count: first.total };
  }

  pipeline = [
    ...base,
    { $sort: { createdAt: -1 } },
    { $skip: offset },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        mobile: 1,
        role: "$roleDoc.name",
        status: 1,
        createdAt:1
      },
    },
  ];

  const docs = await User.aggregate(pipeline);
  const users = docs.map((u) => {
    const { _id, ...rest } = u;
    return { id: String(_id), ...rest };
  });
  return { users, count: 0 };
};

const getUserInfo = async (userId) => {
  const user = await User.findOne({ _id: userId, isDeleted: false })
    .select("username email mobile role image status")
    .populate("role", "name")
    .lean();

  if (!user) return null;

  const { _id, role, ...rest } = user;
  return { id: _id, ...rest, role: role?.name ?? null };
};

const editUser = async (id, data) => {
  const exists = await User.findOne({ _id: id, isDeleted: false }).lean();
  if (!exists) return null;

  const payload = { ...data };

  if (payload.email) {
    const existing = await User.findOne({
      email: payload.email,
      _id: { $ne: id },
      isDeleted: false,
    });
    if (existing) throw new Error("EMAIL EXISTS");
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, SALT_ROUNDS);
  }

  if (payload.role !== undefined) {
    payload.role = await resolveRoleId(payload.role);
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true }
  )
    .select("-__v")
    .populate("role", "name")
    .lean();

  if (!updatedUser) return null;

  const { _id, role, ...rest } = updatedUser;
  return { id: _id, ...rest, role: role?.name ?? null };
};

const deleteUser = async (id) => {
  const res = await User.findByIdAndUpdate(
    id,
    { $set: { isDeleted: true } },
    { new: true }
  ).lean();
  return res;
};

const userAvtarUpload = async (id, imgUrl) => {
  const user = await User.updateOne(
    { _id: id, isDeleted: false },
    { $set: { image: imgUrl } },
    { new: true }
  );
  if (!user) throw new Error("No user found.");
};

const getSingleUser = async (id) => {
  const user = await User.findOne({ _id: id, isDeleted: false })
    .select("-password -__v")
    .populate("role", "name")
    .lean();
  if (!user) return null;
  const { _id, role, ...rest } = user;
  return { id: _id, ...rest, role: role?.name ?? null };
};

export {
  createCustomer,
  createUser,
  loginUser,
  getAllUsers,
  getDynamicUsers,
  getUserInfo,
  editUser,
  deleteUser,
  userAvtarUpload,
  getSingleUser,
};
