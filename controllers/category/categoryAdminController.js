import Category from "../../models/categoryModel.js";
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, title } = req.body;
    if (!name || !title) {
      return res
        .status(400)
        .json({ message: "Category name and title are required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    let imageResult;
    if (req.file) {
      imageResult = await uploadToCloudinary(req.file);
    }

    const category = new Category({
      name,
      title,
      image: imageResult?.secure_url,
    });

    await category.save();

    res.status(201).json({ 
      success: true, 
      message: "Category created successfully", 
      data: category 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ 
      success: true, 
      data: categories 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title } = req.body;

    let imageResult;
    if (req.file) {
      imageResult = await uploadToCloudinary(req.file);
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.image && imageResult) {
      const publicId = category.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    category.name = name || category.name;
    category.title = title || category.title;
    category.image = imageResult?.secure_url || category.image;

    await category.save();

    res.status(200).json({ 
      success: true, 
      message: "Category updated successfully", 
      data: category 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a category..........................................................................................................................................................................................
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.image) {
      const publicId = category.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true, 
      message: "Category deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
