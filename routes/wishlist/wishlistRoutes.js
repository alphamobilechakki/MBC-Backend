
import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../../controllers/wishlist/wishlistController.js";
import authToken from "../../middleware/authToken.js";

const router = express.Router();

// All routes require authentication
router.use(authToken);

router.post("/add", addToWishlist);
router.delete("/remove", removeFromWishlist);
router.get("/", getWishlist);

export default router;
