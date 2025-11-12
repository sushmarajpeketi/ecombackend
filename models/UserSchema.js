import mongoose, { Schema } from "mongoose";

let UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Invalid email format"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [4, "Password must be at least 4 characters"],
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      validate: {
        validator: (v) => /^[0-9]{10}$/.test(v.toString()),
        message: "Mobile number must be 10 digits",
      },
    },

    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    status:{
      type:Boolean,
      default:true
    },

    image: {
      type: String,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Image must be a valid URL",
      },
    },

 
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

let User = mongoose.model("User", UserSchema);
export default User;
