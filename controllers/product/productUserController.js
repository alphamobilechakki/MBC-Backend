import Product from '../../models/productModel.js';

// Get all products with filtering and pagination........................................................................................................................................
export const getProducts = async (req, res) => {
  try {
    const { category, price, rating, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (price) {
      const [min, max] = price.split('-');
      query.sellingPrice = { $gte: min, $lte: max };
    }

    if (rating) {
      query['reviews.rating'] = { $gte: rating };
    }

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: { products, totalPages: Math.ceil(count / limit), currentPage: page },
      message: 'Products retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single product by ID...........................................................................................................................................................
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search products.......................................................................................................................................................................
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ],
    });

    res.status(200).json({
      success: true,
      data: products,
      message: 'Products retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
