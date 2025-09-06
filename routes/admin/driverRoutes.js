import express from 'express';
import {
  createDriver,
  getDrivers,
} from '../../controllers/admin/driverController.js';
import authToken from '../../middleware/authToken.js';
import adminCheck from '../../middleware/adminCheck.js';

const router = express.Router();

// Driver routes
router.post('/drivers', authToken, adminCheck, createDriver);
router.get('/drivers', authToken, adminCheck, getDrivers);

export default router;
