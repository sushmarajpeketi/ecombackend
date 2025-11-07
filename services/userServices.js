import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import { success } from "zod";
import Role from "../models/RoleSchema.js";
const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

const createCustomer = async (data) => {
  const { username, email, password, mobile, image, } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("EMAIL EXISTS");
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    mobile,
    image,
  });

  return user;
};

const createUser = async (data) => {
  const { username, email, password, mobile, image, role } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("EMAIL EXISTS");

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Assign role: use sent role or fallback "user" role
  let roleId;
  if (role) {
    const foundRole = await Role.findById(role);
    if (!foundRole) throw new Error("Role not found");
    roleId = foundRole._id;
  } else {
    const fallbackRole = await Role.findOne({ name: "user" });
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
  });

  return user;
};


const loginUser = async (data) => {
  const { email, password } = data;

  let user = await User.findOne({ email }).populate("role","name").lean();

  if (!user) {
    console.log("user not found");
    return res.status(404).send({ error: "user not found!" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid password");
  }
  let username = user.username;
  console.log({ id: user._id, username, email, ["role"]: user.role?.name})
  const token = jwt.sign(
    { id: user._id, username, email, ["role"]: user.role?.name},
    process.env.SECRETKEY,
    {
      expiresIn: "1hr",
    }
  );
  if (!token) {
    throw new Error("JWT Error");
  }
  return { token, user };
};

const getAllUsers = async () => {
  try {
   const users = await User.find()
  .select("username email mobile image role")
  .populate("role", "name description");

    if (!users || users.length === 0) {
      throw new Error("No users found");
    }

    return users;
  } catch (err) {
    throw new Error("Error fetching users: " + err.message);
  }
};

const getDynamicUsers = async (rows, skip, length, queryObj) => {
  try {
    let count;

    if (length) {
      count = await User.countDocuments(queryObj);
    }

    const rawUsers = await User.find(queryObj)
      .select("-__v") // keep _id internally so we can convert it
      .sort({ _id: 1 })
      .skip(skip)
      .limit(rows)
      .lean();

    const users = rawUsers.map((u) => {
      const { _id, ...rest } = u; // ✅ remove _id before sending
      return {
        id: _id.toString(), // ✅ replace _id with id
        ...rest,
      };
    });

    return { users, count };
  } catch (err) {
    throw new Error("Error fetching users: " + err.message);
  }
};

const getUserInfo = async (userId) => {
  try {
    const user = await User.findById(userId).select(
      "username email mobile role image"
    ).populate("role","name");
    if (!user) return null;

    const userObj = user.toObject();
    return {
      ...userObj,
      id: userObj._id,
      _id: undefined,
      role:userObj.role.name
    };
  } catch (err) {
    throw new Error("Error fetching user info: " + err.message);
  }
};

const editUser = async (id, data) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).select("-__v");

    if (!updatedUser) return null;

    const obj = updatedUser.toObject();
    return { ...obj, id: obj._id, _id: undefined };
  } catch (err) {
    throw new Error("Error updating user: " + err.message);
  }
};

const deleteUser = async (id) => {
  const deletedUser = await User.findByIdAndDelete(id);
  return deletedUser;
};
const userAvtarUpload = async (id, imgUrl) => {
  try {
    const user = await User.updateOne(
      { _id: id },
      { $set: { image: imgUrl } },
      { new: true }
    );

    if (!user) {
      throw new Error("No user found.");
    }
  } catch (e) {
    throw new Error(e.message);
  }
};
const getSingleUser = async (id) => {
  const user = await User.findById(id).select("-password -__v");
  return user;
};


export {
  createCustomer,
  loginUser,
  getAllUsers,
  getDynamicUsers,
  getUserInfo,
  editUser,
  deleteUser,
  userAvtarUpload,
  getSingleUser,
};

export {
  createUser
}