import Category from "../../models/categoryModel.js";
import cloudinary from "../../config/cloudinary.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, title, imageUrl } = req.body;
    if (!name || !title) {
      return res
        .status(400)
        .json({ message: "Category name and title are required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name,
      title,
      image: imageUrl,
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
    const { name, title, imageUrl } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.image && imageUrl) {
      const publicId = category.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    category.name = name || category.name;
    category.title = title || category.title;
    category.image = imageUrl || category.image;

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
