// authorize(["admin"]),(req,res,next)=>{

//   next()
// },

import express from "express";
const router = express.Router();
import upload from "../middlewares/cloudinaryMulterUploadMiddleware.js";

import userAuthenticate from "../middlewares/authenticationMiddleware.js";
import authorize from "./../middlewares/authorizationMiddlware.js";
import validate from "../middlewares/validationMiddleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/schemas/productValidationSchema.js";

import {
  createProductController,
  getProductsController,
  getSingleProductController,
  updateProductController,
  deleteProductController,
  uploadProductImageController,
} from "../controllers/productController.js";

router.post(
  "/create-product",
  userAuthenticate,
  authorize(["admin","superadmin"]),
  validate(createProductSchema),
  createProductController
);

router.get("/", getProductsController);
router.get("/:id", getSingleProductController);

router.post(
  "/upload-image",
  userAuthenticate,
  authorize(["admin","superadmin"]),
  upload.single("image"),
  uploadProductImageController
);

router.put(
  "/:id",
  userAuthenticate,
  authorize(["admin","superadmin"]),
  validate(updateProductSchema),
  updateProductController
);

router.delete("/:id", deleteProductController);

export default router;
