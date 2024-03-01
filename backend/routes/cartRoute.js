import express from 'express';
const router = express.Router();
import {
    addItemToCart,
    getAllItemsInCart
} from '../controllers/cartController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, getAllItemsInCart)
    .post(protect, addItemToCart);

export default router;
