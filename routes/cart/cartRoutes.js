import express from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} from '../../controllers/cart/cartController.js';
import authToken from '../../middleware/authToken.js';

const router = express.Router();

router.use(authToken);

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.route('/items')
  .post(addItemToCart);

router.route('/items/:itemId')
  .put(updateCartItem)
  .delete(removeItemFromCart);

export default router;




