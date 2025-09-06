import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
} from '../controllers/user/userProfileController.js';
import authToken from '../middleware/authToken.js';

const router = express.Router();

// User profile routes
router.get('/user/profile', authToken, getUserProfile);
router.put('/user/profile', authToken, updateUserProfile);

export default router;
