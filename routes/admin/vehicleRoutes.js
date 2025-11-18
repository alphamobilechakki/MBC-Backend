import express from 'express';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  updateVehicleDriver,
} from '../../controllers/admin/vehicleController.js';
import authToken from '../../middleware/authToken.js';
import adminCheck from '../../middleware/adminCheck.js';

const router = express.Router();

// Vehicle routes
router.post('/vehicles', authToken, adminCheck, createVehicle);
router.get('/vehicles', authToken, adminCheck, getVehicles);
router.get('/vehicles/:id', authToken, adminCheck, getVehicleById);
router.put('/vehicles/:id', authToken, adminCheck, updateVehicle);
router.delete('/vehicles/:id', authToken, adminCheck, deleteVehicle);
router.put('/vehicles/:id/driver', authToken, adminCheck, updateVehicleDriver);

export default router;