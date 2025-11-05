import express from "express";
let router = express.Router();
import upload from "../middlewares/cloudinaryMulterUploadMiddleware.js";

import validate from "../middlewares/validationMiddleware.js";
import {
  registerSchema,
  loginSchema,
  updateUserSchema
} from "../validators/schemas/userValidationSchema.js";
import {
  createUserController,
  loginUserController,
  logoutUserController,
  getAllUsersController,
  getDynamicUsersController,
  getUserInfoController,
  editUserController,deleteUserController,uploadUserAvatarController,getSingleUserController
} from "../controllers/userController.js";
import userAuthenticate from "../middlewares/authenticationMiddleware.js";
import authorize from "../middlewares/authorizationMiddlware.js";

router.post("/sign-up", validate(registerSchema), createUserController);
router.post("/sign-in", validate(loginSchema), loginUserController);
router.get('/logout',logoutUserController)
router.get('/all-users',userAuthenticate,authorize(["admin"]),getAllUsersController)
router.get('/',userAuthenticate,authorize(['customer',"admin"]),getDynamicUsersController)
router.get('/user-info',userAuthenticate,authorize(["admin","customer"]),getUserInfoController)
router.put('/:id',validate(updateUserSchema),userAuthenticate,authorize(["admin"]),editUserController)
router.delete('/:id',userAuthenticate,authorize(["admin","customer"]),deleteUserController)
router.post('/upload-avatar', userAuthenticate,authorize("admin","customer") ,upload.single('avatar'),uploadUserAvatarController );
router.get("/:id", userAuthenticate, authorize(["admin", "customer"]), getSingleUserController);

export default router;
