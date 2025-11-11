import express from 'express';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from '../../controllers/admin/vehicleController.js';
import upload from '../../middleware/multer.js';
import cloudinaryUpload from '../../middleware/cloudinaryUploadMultiple.js';

const router = express.Router();

router.post(
  '/',
  upload.fields([
    { name: 'rc', maxCount: 1 },
    { name: 'puc', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
  ]),
  cloudinaryUpload,
  createVehicle
);outer.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.put(
  '/:id',
  upload.fields([
    { name: 'rc', maxCount: 1 },
    { name: 'puc', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
  ]),
  cloudinaryUpload,
  updateVehicle
);
router.delete('/:id', deleteVehicle);

export default router;
