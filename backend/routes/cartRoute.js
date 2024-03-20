import express from 'express';
const router = express.Router();
import {
    addItemToCart,
    getAllItemsInCart,
    deleteItem,
    deleteAllItemsInCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';
router.delete('/:id', protect, checkObjectId, deleteItem);
router.route('/')
    .get(protect, getAllItemsInCart)
    .post(protect, addItemToCart)


export default router;
