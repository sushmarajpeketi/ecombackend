
import { z } from "zod";

export const categoryName = z
  .string()
  .min(2, "Category name must be at least 2 characters")
  .max(50, "Category name cannot exceed 50 characters");
