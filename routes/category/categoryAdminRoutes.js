import express from 'express';
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from '../../controllers/category/categoryAdminController.js';
import adminCheck from '../../middleware/adminCheck.js';
import upload from '../../middleware/multer.js';

const router = express.Router();

// Admin Category routes
router.post('/categories', adminCheck, upload.single('image'), createCategory);
router.get('/categories', adminCheck, getAllCategories);
router.put('/categories/:id', adminCheck, upload.single('image'), updateCategory);
router.delete('/categories/:id', adminCheck, deleteCategory);

export default router;
