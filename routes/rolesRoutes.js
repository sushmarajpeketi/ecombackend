import express from "express";
let router = express.Router();



import validate from "../middlewares/validationMiddleware.js";

import userAuthenticate from "../middlewares/authenticationMiddleware.js";
import authorize from "../middlewares/authorizationMiddlware.js";


import { createRoleController, deleteRoleController, editRoleController, getAllRolesController } from "../controllers/roleController.js";


router.post("/create-role", createRoleController);
router.get('/',getAllRolesController)
router.put('/:id',editRoleController)
router.delete('/:id',deleteRoleController)

export default router;
