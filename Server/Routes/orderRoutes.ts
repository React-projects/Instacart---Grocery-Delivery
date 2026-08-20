import express from 'express';
import auth from '../middleware/Auth.js';
import { createOrder, getAllOrders, getOrderById, getOrderLocation, getUsersOrder, updateOrderStatus, verifyStripePayment } from '../controllers/OrdersController.js';
import admin from '../middleware/Admin.js';
const orderRouter = express.Router();

orderRouter.post('/', auth, createOrder);
orderRouter.post('/verify-stripe', auth, verifyStripePayment);
orderRouter.get('/', auth, getUsersOrder);
orderRouter.get('/all', auth, admin, getAllOrders);
orderRouter.get('/:id', auth, getOrderById);
orderRouter.put('/:id/status', auth, admin, updateOrderStatus);
orderRouter.get('/:id/location', auth, getOrderLocation);

export default orderRouter;
