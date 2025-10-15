
import Wishlist from "../../models/wishlistModel.js";

// Add item to wishlist
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId; // Get userId from auth token

  try {
    const existingItem = await Wishlist.findOne({ userId, productId });

    if (existingItem) {
      return res.status(400).json({ message: "Item already in wishlist" });
    }

    const wishlistItem = new Wishlist({ userId, productId });
    await wishlistItem.save();

    res.status(201).json({ message: "Item added to wishlist", wishlistItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId; // Get userId from auth token

  try {
    const wishlistItem = await Wishlist.findOneAndDelete({ userId, productId });

    if (!wishlistItem) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
  const userId = req.userId; // Get userId from auth token

  try {
    const wishlist = await Wishlist.find({ userId }).populate("productId");

    res.status(200).json({ wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
