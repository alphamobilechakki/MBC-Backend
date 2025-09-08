import Category from "../../models/categoryModel.js";


//Get all Categories
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

