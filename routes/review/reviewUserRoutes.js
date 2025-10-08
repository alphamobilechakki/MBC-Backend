import express from 'express';
import {
  createReview,
  getReviewsByProduct,
} from '../../controllers/review/reviewUserController.js';
import authToken from '../../middleware/authToken.js';

const router = express.Router();

// Review routes
router.post('/reviews/:productId',authToken ,  createReview);
router.get('/reviews/:productId', getReviewsByProduct);

export default router;
