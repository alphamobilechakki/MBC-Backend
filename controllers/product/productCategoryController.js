import Product from "../../models/productModel.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
