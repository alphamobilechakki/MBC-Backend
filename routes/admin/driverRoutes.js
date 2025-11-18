import express from 'express';
import {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} from '../../controllers/admin/driverController.js';
import authToken from '../../middleware/authToken.js';
import adminCheck from '../../middleware/adminCheck.js';

const router = express.Router();

// Driver routes
router.post('/drivers', authToken, adminCheck, createDriver);
router.get('/drivers', authToken, adminCheck, getDrivers);
router.get('/drivers/:id', authToken, adminCheck, getDriverById);
router.put('/drivers/:id', authToken, adminCheck, updateDriver);
router.delete('/drivers/:id', authToken, adminCheck, deleteDriver);

export default router;
