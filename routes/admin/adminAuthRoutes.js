import express from 'express';
import {
  adminLogin,
} from '../../controllers/admin/adminAuthController.js';

const router = express.Router();

// Admin Auth routes
router.post('/login', adminLogin);

export default router;
