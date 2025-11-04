import express from 'express'
const router = express.Router()

import {createCategorySchema, updateCategorySchema } from '../validators/schemas/categoryValidationSchema.js'
import validate from '../middlewares/validationMiddleware.js'
import userAuthentication from '../middlewares/authenticationMiddleware.js'
import authorize from '../middlewares/authorizationMiddlware.js'

import { createCategoryController } from '../controllers/categoryController.js'

router.post('/create-category',userAuthentication,authorize(["admin"]),validate(createCategorySchema),createCategoryController)

export default router