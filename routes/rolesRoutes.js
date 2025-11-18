import express from "express";
let router = express.Router();

import validate from "../middlewares/validationMiddleware.js";
import userAuthenticate from "../middlewares/authenticationMiddleware.js";
import authorize from "../middlewares/authorizationMiddlware.js";

import {
  createRoleController,
  deleteRoleController,
  editRoleController,
  getRolesController,
  getAllRolesController,
  getModulesAndPermissionsController,
  getRoleByIdController,
  createRoleNController, 
} from "../controllers/roleController.js";
import { createRoleN } from "../services/roleService.js";

router.post("/create-role",
  // userAuthenticate, authorize(["admin","superadmin"]),
   createRoleController);
router.post("/create-roleN",
  // userAuthenticate, authorize(["admin","superadmin"]),
   createRoleNController);


router.get("/modules-permissions",userAuthenticate, authorize(["admin","superadmin"]), getModulesAndPermissionsController);

router.get("/",
  //  userAuthenticate, authorize(["admin","superadmin"]),
   getRolesController);
router.get("/",
  //  userAuthenticate, authorize(["admin","superadmin"]),
   getAllRolesController);


router.get("/:id",userAuthenticate, 
  // authorize(["admin","superadmin"]), 
  getRoleByIdController);

router.put("/edit/:id",userAuthenticate, 
  // authorize(["admin","superadmin"]),
   editRoleController);

router.delete("/:id",userAuthenticate, 
  // authorize(["admin","superadmin"]), 
  deleteRoleController);

export default router;
