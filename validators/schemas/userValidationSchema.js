import { z } from "zod";
import { username, email, password, mobile, role, image } from "../fields/userFields.js";

export const registerSchema = z.object({
  username,
  email,
  password,
  mobile,
  image,
  role: role.optional()
});

export const loginSchema = z.object({
  email,
  password
});

export const updateUserSchema = z.object({
  username: username.optional(),
  email: email.optional(),
  password: password.optional(),
  mobile: mobile.optional(),
  image,
  role: role.optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be updated",
});
