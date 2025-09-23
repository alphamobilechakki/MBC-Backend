import express from 'express';

import  {getAllCategories}  from '../../controllers/category/categoryUserController.js';
import authToken from '../../middleware/authToken.js';

const router = express.Router();

router.get('/categories',  getAllCategories);

export default router;
