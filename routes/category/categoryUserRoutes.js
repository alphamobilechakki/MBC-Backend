import express from 'express';

import  {getAllCategories}  from '../../controllers/category/categoryUserController.js';

const router = express.Router();

router.get('/categories',  getAllCategories);

export default router;
