import {
  createProductService,
  getProductsService,
  getSingleProductService,
  updateProductService,
  deleteProductService,
  uploadImageService,
} from "../services/productServices.js";

import { ZodError } from "zod";

export const createProductController = async (req, res) => {
  try {
    const body = req.validatedData; 
    const product = await createProductService(body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getProductsController = async (req, res) => {
  try {
    const { products, total } = await getProductsService(req.query);

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(req.query.page) || 0,
      rows: parseInt(req.query.rows) || 10,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getSingleProductController = async (req, res) => {
  try {
    const product = await getSingleProductService(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateProductController = async (req, res) => {
  try {
    const updates = req.validatedData; 

    const updated = await updateProductService(req.params.id, updates);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteProductController = async (req, res) => {
  try {
    const deleted = await deleteProductService(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const uploadProductImageController = async (req, res) => {
  try {
    console.log("----------------",req.auth)
    const url = await uploadImageService(req.file);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
