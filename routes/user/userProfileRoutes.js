import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  updateAddress,
  deleteAddress,
  getDefaultAddress,
} from '../../controllers/user/userProfileController.js';
import { addAddress } from '../../controllers/user/addressController.js';
import authToken from '../../middleware/authToken.js';

const router = express.Router();

// User profile routes
router.get('/profile', authToken, getUserProfile);
router.put('/profile', authToken, updateUserProfile);
router.post('/profile/address', authToken, addAddress);
router.put('/profile/address/:addressId', authToken, updateAddress);
router.delete('/profile/address/:addressId', authToken, deleteAddress);
router.get('/profile/address/default', authToken, getDefaultAddress);


export default router;

