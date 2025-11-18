import express from 'express';
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  startTrip,
  endTrip,
  updateTripStatus,
} from '../../controllers/trip/tripController.js';
import authToken from '../../middleware/authToken.js';

const router = express.Router();

// Trip routes
router.post('/trips', authToken, createTrip);
router.get('/trips', authToken, getTrips);
router.get('/trips/:id', authToken, getTripById);
router.put('/trips/:id', authToken, updateTrip);
router.delete('/trips/:id', authToken, deleteTrip);
router.post('/trips/:id/start', authToken, startTrip);
router.post('/trips/:id/end', authToken, endTrip);
router.put('/trips/:id/status', authToken, updateTripStatus);

export default router;