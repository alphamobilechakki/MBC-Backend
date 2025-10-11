import express from 'express';
import {
  adminLogin,
  adminSignUp,
} from '../../controllers/admin/adminAuthController.js';
import { driverLogin } from '../../controllers/admin/driverAuthController.js';

const router = express.Router();

// Admin Auth routes
router.post('/signup', adminSignUp);
router.post('/login', adminLogin);

// Driver Auth routes
router.post('/driver/login', driverLogin);

export default router;
