import { z } from "zod";

export const productName = z
  .string()
  .min(3, "Product name must be at least 3 characters");

export const productDescription = z
  .string()
  .min(4, "Product description must be at least 4 characters");

export const productPrice = z.coerce
  .number()
  .min(1, "Price must be at least 1");

export const productCategory = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const productImage = z
  .string()
  .url("Invalid image URL")
  .optional()
  .nullable();
