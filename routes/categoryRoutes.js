import express from "express";
const router = express.Router();

import { createCategorySchema, updateCategorySchema } from "../validators/schemas/categoryValidationSchema.js";
import validate from "../middlewares/validationMiddleware.js";
import userAuthentication from "../middlewares/authenticationMiddleware.js";
import authorize from "../middlewares/authorizationMiddlware.js";

import {
  createCategoryController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController,
  getSingleCategoryController,
} from "../controllers/categoryController.js";

router.post("/create-category",
   userAuthentication,
    // authorize(["admin","superadmin"]), 
    validate(createCategorySchema), createCategoryController);
router.get("/", userAuthentication, getAllCategoriesController);
router.put("/:id", userAuthentication, 
  // authorize(["admin","superadmin"]),
   validate(updateCategorySchema), updateCategoryController);
router.delete("/:id", userAuthentication,
  //  authorize(["admin","superadmin"]),
    deleteCategoryController);
router.get("/:id", userAuthentication,
  //  authorize(["admin","superadmin"]), 
   getSingleCategoryController);

export default router;
