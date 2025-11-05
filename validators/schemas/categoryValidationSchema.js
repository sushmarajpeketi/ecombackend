import { z } from "zod";
import {
  categoryName,
  categoryDescription,
  categoryStatus,
} from "../fields/CategoryField.js";

export const createCategorySchema = z.object({
  name: categoryName,
  description: categoryDescription,
  status: categoryStatus,
});

export const updateCategorySchema = z
  .object({
    name: categoryName.optional(),
    description: categoryDescription.optional(),
    status: categoryStatus.optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "At least one field must be updated",
    }
  );
