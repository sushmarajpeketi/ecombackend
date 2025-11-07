import express from "express";
let router = express.Router();

import validate from "../middlewares/validationMiddleware.js";
import userAuthenticate from "../middlewares/authenticationMiddleware.js";
import authorize from "../middlewares/authorizationMiddlware.js";

import {
  createRoleController,
  deleteRoleController,
  editRoleController,
  getAllRolesController,
  getModulesAndPermissionsController,
  getRoleByIdController, 
} from "../controllers/roleController.js";

router.post("/create-role", createRoleController);


router.get("/modules-permissions", getModulesAndPermissionsController);

router.get("/", getAllRolesController);

router.get("/:id", getRoleByIdController);

router.put("/edit/:id", editRoleController);

router.delete("/:id", deleteRoleController);

export default router;
