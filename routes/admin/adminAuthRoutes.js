import express from 'express';
import {
  adminLogin,
  adminSignUp,
} from '../../controllers/admin/adminAuthController.js';

const router = express.Router();

// Admin Auth routes
router.post('/signup', adminSignUp);
router.post('/login', adminLogin);

export default router;
