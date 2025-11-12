import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    description:{
        type:String,
        trim:true
    },
    status:{
      type:Boolean,
      default:true
    },
    isDeleted:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);
const Category = mongoose.model("Category", CategorySchema);
export default Category
