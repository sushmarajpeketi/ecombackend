import mongoose, { Schema } from "mongoose";
const MODULES = ["users", "products", "dashboard", "categories"];
const OPERATIONS = ["read", "write", "delete"];

import User from "./UserSchema.js";
import { trim } from "zod";

let RoleSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "name is required"],
      minlength: [3, "name must be at least 3 characters"],
      trim: true,
      maxlength: [20, "Name cannot exceed 20 characters"],
    },

    description: {
      type: String,
      required: [true, "description is required"],
      minlength: [3, "description must be at least 3 characters"],
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },

    permissions: {
      type: Map,
      of: {
        type: [String],
        enum: OPERATIONS,
      },
      validate: {
        validator: (value) => {
          return (
            [...value.keys()].every((key) => MODULES.includes(key)) &&
            [...value.values()].every((arr) =>
              arr.every((op) => OPERATIONS.includes(op))
            )
          );
        },
        message: "Invalid modules or operations in permissions",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },

    // permissions: {
    //   type: Object,

    //   validate: {
    //     validator: (value) => {
    //         const keys = [...Object.keys(value)].every((key) => MODULES.includes(key));
    //         const values = [...Object.values(value)].every((key) =>key.every((el)=>OPERATIONS.includes(el)));
    //         return keys && values
    //     },
    //     message: () => `Invalid modules found`,
    //   },
    // },
  },
  { timestamps: true }
);

RoleSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const roleId = this._id;

    const usersAssigned = await User.countDocuments({ role: roleId });
    if (usersAssigned > 0) {
      return next(new Error("Cannot delete role: users are assigned to it"));
    }

    next();
  }
);

let Role = mongoose.model("Role", RoleSchema);
export default Role;
