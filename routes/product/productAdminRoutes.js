import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../controllers/product/productAdminController.js';
import authToken from '../../middleware/authToken.js';
import adminCheck from '../../middleware/adminCheck.js';
import cloudinaryUploadMultiple from '../../middleware/cloudinaryUploadMultiple.js';

const router = express.Router();

// ✅ Admin Product routes
router.post(
  '/products',
  authToken,
  adminCheck,
  cloudinaryUploadMultiple,
  createProduct
);

router.put(
  '/products/:id',
  authToken,
  adminCheck,
  cloudinaryUploadMultiple,
  updateProduct
);

router.delete(
  '/products/:id',
  authToken,
  adminCheck,
  deleteProduct
);

export default router;
