// authorize(["admin"]),(req,res,next)=>{

//   next()
// },

import express from "express";
const router = express.Router();


import userAuthenticate from "../middlewares/authenticationMiddleware.js";
import authorize from "./../middlewares/authorizationMiddlware.js";
import validate from "../middlewares/validationMiddleware.js";
import { createModuleController,deleteModuleController,getAllModulesController,getModuleController,getModulesController, getModulesNamesController, updateModuleController } from "../controllers/moduleController.js";
import { getDynamicModules } from "../services/moduleServices.js";



router.post(
  "/create-module",
//   userAuthenticate,
//   authorize(["admin","superadmin"]),
//   validate(createProductSchema),
  createModuleController
);

router.get("/", getModulesController);
router.get("/single/:id", getModuleController);
router.get("/names", getModulesNamesController);
router.get("/dynamic", getAllModulesController);
router.put("/:id",updateModuleController)
router.delete("/:id",deleteModuleController)

// router.get("/:id", getSingleProductController);

// router.post(
//   "/upload-image",
//   userAuthenticate,
//   authorize(["admin","superadmin"]),
//   upload.single("image"),
//   uploadProductImageController
// );

// router.put(
//   "/:id",
//   userAuthenticate,
//   authorize(["admin","superadmin"]),
//   validate(updateProductSchema),
//   updateProductController
// );

// router.delete("/:id", deleteProductController);

export default router;
