import express from 'express';
import {
  updateOrderStatus,
} from '../../controllers/order/orderAdminController.js';
import authToken from '../../middleware/authToken.js';
import adminCheck from '../../middleware/adminCheck.js';

const router = express.Router();

// Admin Order routes
router.put('/orders/:id/status', authToken, adminCheck, updateOrderStatus);

export default router;
