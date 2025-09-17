import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../controllers/product/productAdminController.js';
import authToken from '../../middleware/authToken.js';
import adminCheck from '../../middleware/adminCheck.js';

const router = express.Router();

// ✅ Admin Product routes (no multer, just URLs in req.body)
router.post(
  '/products',
  authToken,
  adminCheck,
  createProduct
);

router.put(
  '/products/:id',
  authToken,
  adminCheck,
  updateProduct
);

router.delete(
  '/products/:id',
  authToken,
  adminCheck,
  deleteProduct
);

export default router;
