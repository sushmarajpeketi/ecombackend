import {
  createCustomer,
  loginUser,
  getAllUsers,
  getDynamicUsers,
  getUserInfo,
  editUser,
  deleteUser,
  userAvtarUpload,
  getSingleUser,
  createUser
} from "../services/userServices.js";

const createCustomerController = async (req, res) => {
  try {
    const user = await createCustomer(req.validatedData);
    return res.status(201).json({ success: true, message: "SignUp successfully", user });
  } catch (error) {
    if (error.message === "EMAIL EXISTS") {
      return res.status(409).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const createUserController = async (req, res) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error.message === "EMAIL EXISTS") {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }
    if (error.message === "Role not found" || error.message === "Fallback role not found") {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

const loginUserController = async (req, res) => {
  try {
    const { token, user } = await loginUser(req.validatedData);
    try {
      res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to set cookie",
        code: "COOKIE_ERROR",
        error: err.message,
      });
    }
    return res.status(200).json({ success: true, message: "Login successful", user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const logoutUserController = async (_req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

const getAllUsersController = async (_req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json({
      success: true,
      message: "All users are fetched successfully.",
      data: users,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getDynamicUsersController = async (req, res) => {
  try {
    let { page, rows, username, email, length } = req.query;

    let queryObj = { isDeleted: false }; 
    if (username) queryObj.username = { $regex: username, $options: "i" };
    if (email) queryObj.email = { $regex: email, $options: "i" };

    page = parseInt(page) || 0;
    rows = parseInt(rows) || 10;
    const skip = page * rows;

    const { users, count } = await getDynamicUsers(rows, skip, length, queryObj);

    return res.status(200).json({
      success: true,
      message: "users fetch is successfull",
      data: { users, count },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getUserInfoController = async (req, res) => {
  try {
    const userId = req.auth.id;
    const user = await getUserInfo(userId);
    if (!user) return res.status(401).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editUserController = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await editUser(id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found or not updated" });
    }
    return res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const deleteUserController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await deleteUser(id); 
    if (!deletedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const uploadUserAvatarController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const imageUrl = req.file.path;
    const userId = req.auth.id;
    await userAvtarUpload(userId, imageUrl);
    res.status(200).json({
      success: "true",
      message: "Image uploaded successfully",
      data: { url: imageUrl },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSingleUserController = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.auth.role === "customer" && req.auth.id !== id) {
      return res.status(403).json({ success: false, message: "You are not allowed to access this user" });
    }
    const user = await getSingleUser(id); // filtered for isDeleted:false
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User fetched successfully", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export {
  createCustomerController,
  loginUserController,
  logoutUserController,
  getAllUsersController,
  getDynamicUsersController,
  getUserInfoController,
  editUserController,
  deleteUserController,
  uploadUserAvatarController,
  getSingleUserController,
  createUserController,
};
