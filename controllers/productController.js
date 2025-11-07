import {
  createProductService,
  getProductsService,
  getSingleProductService,
  updateProductService,
  deleteProductService,
  uploadProductImageService,
} from "../services/productServices.js";
import { ZodError } from "zod";

export const createProductController = async (req, res) => {
  try {
    const product = await createProductService(req.validatedData);
    return res.status(201).json({ success: true, message: "Product created successfully", data: product });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ success: false, message: error.issues[0]?.message });
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductsController = async (req, res) => {
  try {
    const { data, total, page, rows } = await getProductsService(req.query);
    return res.status(200).json({ success: true, message: "Products fetched successfully", data, total, page, rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await getSingleProductService(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.status(200).json({ success: true, message: "Product fetched successfully", data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const product = await updateProductService(req.params.id, req.validatedData);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.status(200).json({ success: true, message: "Product updated successfully", data: product });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ success: false, message: error.issues[0]?.message });
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const del = await deleteProductService(req.params.id);
    if (!del) return res.status(404).json({ success: false, message: "Product not found" });
    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadProductImageController = async (req, res) => {
  try {
    const url = await uploadProductImageService(req.file);
    return res.status(200).json({ success: true, message: "Image uploaded successfully", url });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
