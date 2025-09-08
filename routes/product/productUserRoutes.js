import express from 'express';
import {
  getProducts,
  getProductById,
  searchProducts,
} from '../../controllers/product/productUserController.js';
import { getAllCategories } from '../../controllers/product/productCategoryController.js';

const router = express.Router();

// User Product routes
router.get('/products', getProducts);
router.get('/products/search', searchProducts);
router.get('/products/categories', getAllCategories);
router.get('/products/:id', getProductById);

export default router;
