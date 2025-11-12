import { z } from "zod";
import { username, email, password, mobile, role, image } from "../fields/userFields.js";

export const registerSchema = z.object({
  username,
  email,
  password,
  mobile,
  image,
  role: role.optional(), // backend will resolve or fallback to "user"
});

export const loginSchema = z.object({
  email,
  password,
});

export const updateUserSchema = z
  .object({
    username: username.optional(),
    email: email.optional(),
    password: password.optional(),
    mobile: mobile.optional(),
    image,
    role: role.optional(),
    status: z.boolean().optional(), // ✅ allow toggling status
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    { message: "At least one field must be updated" }
  );
