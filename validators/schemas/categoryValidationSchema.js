import { z } from "zod";
import { categoryName } from "../fields/categoryFields.js";

export const createCategorySchema = z.object({
  name: categoryName,
});

export const updateCategorySchema = z.object({
  name: categoryName.optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be updated",
});
