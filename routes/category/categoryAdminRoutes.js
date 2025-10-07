import express from 'express';
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from '../../controllers/category/categoryAdminController.js';
import authToken from '../../middleware/authToken.js';
import adminCheck from '../../middleware/adminCheck.js';
import cloudinaryUpload from '../../middleware/cloudinaryUpload.js';
import upload from "../../middleware/multer.js";

const router = express.Router();

// Admin Category routes
router.post('/categories',authToken , adminCheck, upload.single('image'), cloudinaryUpload, createCategory);
router.get('/categories',authToken, adminCheck, getAllCategories);
router.put('/categories/:id',authToken , adminCheck, upload.single('image'), cloudinaryUpload, updateCategory);
router.delete('/categories/:id', authToken ,  adminCheck, deleteCategory);

export default router;
