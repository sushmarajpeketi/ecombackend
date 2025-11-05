import { z } from "zod";

export const productName = z
  .string()
  .min(3, "Product name must be at least 3 characters");

export const productDescription = z
  .string()
  .min(5, "Product description must be at least 5 characters");

export const productPrice = z
  .number()
  .min(1, "Price must be at least 1");

export const productCategory = z
  .string()
  .min(2, "Category must be at least 2 characters")
  .regex(/^[a-zA-Z\s]+$/, "Category must contain only letters");

export const productImage = z
  .string()
  .url("Invalid image URL")
  .optional()
  .nullable();

export const createProductSchema = z.object({
  name: productName,
  description: productDescription,
  price: productPrice,
  category: productCategory,
  image: productImage.optional(),
});

export const updateProductSchema = z.object({
  name: productName.optional(),
  description: productDescription.optional(),
  price: productPrice.optional(),
  category: productCategory.optional(),
  image: productImage.optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be updated",
});
