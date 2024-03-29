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
  getMyOrderNotValid,
  placeOrder,
  getMail
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/qr').post(protect, getMail);
router.route('/mine').get(protect, getMyOrders);
router.route('/payment').get(protect, getMyOrderNotValid).post(protect, updatePaymentMethod);
router.route('/:id').get(protect, getOrderById).put(protect, placeOrder);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);


export default router;
