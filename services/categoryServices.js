import Category from "../models/CategorySchema.js";

const createCategory = async ({ name }) => {
  const newCategory = await Category.create({ name }); 
  return newCategory;   
};


export {createCategory}