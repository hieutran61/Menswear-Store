import express from 'express';
const router = express.Router();
import {
    addItemToCart,
    getCart
} from '../controllers/cartController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addItemToCart).get(protect, getCart);

export default router;
