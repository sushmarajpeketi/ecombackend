import { z } from "zod";

export const productName = z
  .string()
  .min(3, "Product name must be at least 3 characters");

export const productDescription = z
  .string()
  .min(4, "Product description must be at least 4 characters");

export const productPrice = z.preprocess(
  (val) => (typeof val === "string" ? Number(val) : val),
  z.number().min(1, "Price must be at least 1")
);

// ✅ Category must be ObjectId, NOT letters
export const productCategory = z
  .string()
  .trim()
  .min(1, "Category is required")
  .refine(
    (value) => /^[0-9a-fA-F]{24}$/.test(value) || /^[a-zA-Z\s]+$/.test(value),
    "Category must be an ObjectId or a valid name"
  );

// Image can be optional or null
export const productImage = z.string().url().optional().nullable();

export const createProductSchema = z.object({
  name: productName,
  description: productDescription,
  price: productPrice,
  category: productCategory, // ObjectId required
  image: productImage.optional(),
  status: z.boolean().optional(),
});

export const updateProductSchema = z
  .object({
    name: productName.optional(),
    description: productDescription.optional(),
    price: productPrice.optional(),
    category: productCategory.optional(),
    image: productImage.optional(),

    // ✅ ADD THIS
    status: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be updated",
  });
