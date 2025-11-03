import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import { success } from "zod";

const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

const createUser = async (data) => {
  const { username, email, password, mobile, image } = data;

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

const loginUser = async (data) => {
  const { email, password } = data;

  let user = await User.findOne({ email });

  if (!user) {
    console.log("user not found");
    return res.status(404).send({ error: "user not found!" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid password");
  }
  let username = user.username;
  const token = jwt.sign(
    { id: user._id, username, email, role: user.role },
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
    const users = await User.aggregate([
      {
        $project: {
          id: "$_id",
          _id: 0,
          email: 1,
          username: 1,
          mobile: 1,
          image: 1,
          role: 1,
        },
      },
    ]);

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
    let count = 0;
    if (length) {
      count = await User.find(queryObj).countDocuments();
    }
    const sortedUsers = await User.find(queryObj)
      .select("-__v")
      .sort({ _id: 1 })
      .skip(skip)
      .limit(rows)
      .lean();
    const users = sortedUsers.map((u) => ({
      id: u._id.toString(),
      ...u,
      _id: undefined,
    }));
    return { users, count };
  } catch (err) {
    throw new Error("Error fetching users: " + err.message);
  }
};

const getUserInfo = async (userId) => {
  try {
    const user = await User.findById(userId).select(
      "username email mobile role image"
    );

    if (!user) return null;

    const userObj = user.toObject();
    return {
      ...userObj,
      id: userObj._id,
      _id: undefined,
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
      { $set: { img: imgUrl } },
      { new: true }
    );

    if (!user) {
      throw new Error("No user found.");
    }
  } catch (e) {
    throw new Error(e.message);
  }
};
export {
  createUser,
  loginUser,
  getAllUsers,
  getDynamicUsers,
  getUserInfo,
  editUser,
  deleteUser,
  userAvtarUpload,
};
