import mongoose, { Schema } from "mongoose";
import { getModulesNames } from "../services/moduleServices.js";

import User from "./UserSchema.js";
import constants from "../constants.js";
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
        enum: constants.OPERATIONS,
      },
      validate: {
        validator: async function (value) {
          const MODULES = await getModulesNames();
          const keysValid = [...value.keys()].every((key) => {
            return MODULES.includes(key);
          });

          const opsValid = [...value.values()].every((arr) =>
            arr.every((op) => constants.OPERATIONS.includes(op))
          );
       
          return keysValid && opsValid;
        },
        message: "Invalid modules or operations in permissions",
      },
    },

    // modules:[{
    //   type: Schema.Types.ObjectId,
    //   ref: "Module",
    //   required: true,
    // }],
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
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

RoleSchema.set("toJSON", {
  transform: (_, ret) => {
    if (ret.permissions instanceof Map) {
      ret.permissions = Object.fromEntries(ret.permissions);
    }
    return ret;
  },
});

let Role = mongoose.model("Role", RoleSchema);
export default Role;
