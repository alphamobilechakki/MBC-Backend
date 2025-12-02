import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
} from '../../controllers/order/orderUserController.js';
import authToken from '../../middleware/authToken.js';

const router = express.Router();

// Order routes
router.post('/orders', createOrder);
router.get('/orders', authToken, getOrders);
router.get('/orders/:id', authToken, getOrderById);

export default router;
