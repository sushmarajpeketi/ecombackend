import express from "express";
let router = express.Router();
import upload from "../middlewares/cloudinaryMulterUploadMiddleware.js";

import validate from "../middlewares/validationMiddleware.js";
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
} from "../validators/schemas/userValidationSchema.js";

import {
  createUserController,
  loginUserController,
  logoutUserController,
  getAllUsersController,
  getDynamicUsersController,
  getUserInfoController,
  editUserController,
  deleteUserController,
  uploadUserAvatarController,
  getSingleUserController,
  createCustomerController,
} from "../controllers/userController.js";

import userAuthenticate from "../middlewares/authenticationMiddleware.js";
import authorize from "../middlewares/authorizationMiddlware.js";

router.post("/sign-up", validate(registerSchema), createCustomerController);
router.post("/sign-in", validate(loginSchema), loginUserController);
router.get("/logout", logoutUserController);

router.get(
  "/all-users",
  userAuthenticate,
  // authorize(["admin", "superadmin"]),
  getAllUsersController
);

router.get(
  "/",
  userAuthenticate,
  // authorize(["customer", "admin", "superadmin"]),
  getDynamicUsersController
);

router.get("/user-info",
   userAuthenticate,
    getUserInfoController);

router.put(
  "/:id",
  validate(updateUserSchema),
  userAuthenticate,
  // authorize(["admin", "superadmin"]),
  editUserController
);

router.delete(
  "/:id",
  userAuthenticate,
  // authorize(["admin", "customer", "superadmin"]),
  deleteUserController
);

router.post(
  "/upload-avatar",
  userAuthenticate,
  upload.single("avatar"),
  uploadUserAvatarController
);

router.get(
  "/:id",
  userAuthenticate,
  // authorize(["admin", "customer", "superadmin"]),
  getSingleUserController
);

router.post("/employee/create", createUserController);

export default router;
