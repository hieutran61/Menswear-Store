import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  createOrder,
  updatePaymentMethod,
  getMyOrderNotValid
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/payment').get(protect, getMyOrderNotValid);
router.route('/:id').get(protect, getOrderById).put(protect, updatePaymentMethod);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;
