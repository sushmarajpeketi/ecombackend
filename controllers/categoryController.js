import {createCategory} from '../services/categoryServices.js'

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.validatedData;

    const category = await createCategory({ name });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

const getAllCategoriesController = async (req,res)=>{
    
}

export {createCategoryController}