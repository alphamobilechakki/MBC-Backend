import express from 'express';
import {
  adminLogin,
  createDriver,
  getDrivers,
} from '../controllers/admin/adminController.js';
import authToken from '../middleware/authToken.js';
import adminCheck from '../middleware/adminCheck.js';

const router = express.Router();

// Admin routes
router.post('/admin/login', adminLogin);
router.post('/admin/drivers', authToken, adminCheck, createDriver);
router.get('/admin/drivers', authToken, adminCheck, getDrivers);

export default router;
