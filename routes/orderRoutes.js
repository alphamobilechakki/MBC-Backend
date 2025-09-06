import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/order/orderController.js';
import authToken from '../middleware/authToken.js';
import adminCheck from '../middleware/adminCheck.js';

const router = express.Router();

// Order routes
router.post('/orders', authToken, createOrder);
router.get('/orders', authToken, getOrders);
router.get('/orders/:id', authToken, getOrderById);
router.put('/orders/:id/status', authToken, adminCheck, updateOrderStatus);

export default router;
