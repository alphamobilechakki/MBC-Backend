import Review from '../../models/reviewModel.js';
import Product from '../../models/productModel.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    const userId = req.user._id;

    const review = new Review({
      product: productId,
      user: userId,
      rating,
      comment,
    });

    await review.save();

    // Add the review to the product's reviews array
    await Product.findByIdAndUpdate(productId, {
      $push: { reviews: review._id },
    });

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all reviews for a product
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate('user', 'name');

    res.status(200).json({
      success: true,
      data: reviews,
      message: 'Reviews retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
