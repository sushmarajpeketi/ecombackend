import { z } from "zod";
import {
  productName,
  productDescription,
  productPrice,
  productCategory,
  productImage
} from "../fields/productFields.js";

export const createProductSchema = z.object({
  name: productName,
  description: productDescription,
  price: productPrice,
  category: productCategory,
  image: productImage.optional()
});

export const updateProductSchema = z.object({
  name: productName.optional(),
  description: productDescription.optional(),
    price: productPrice.optional(),
  category: productCategory.optional(),
  image: productImage.optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be updated",
});
export const updateImageSchema = productImage
