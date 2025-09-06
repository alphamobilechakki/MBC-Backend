import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product/productController.js';
import authToken from '../middleware/authToken.js';

const router = express.Router();

// Product routes
router.post('/products', authToken, createProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', authToken, updateProduct);
router.delete('/products/:id', authToken, deleteProduct);

export default router;
