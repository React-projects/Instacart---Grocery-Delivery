import express from 'express';
import { assignDeliveryPartner, createDeliveryPartner, getAdminState, getDeliveryPartners, updateDeliveryPartner } from '../controllers/AdminController.js';
const adminRouter = express.Router();

adminRouter.get('/stats', getAdminState);
adminRouter.get('/delivery-partner', getDeliveryPartners);
adminRouter.post('/delivery-partner', createDeliveryPartner);
adminRouter.put('/delivery-partner/:id', updateDeliveryPartner);
adminRouter.put('/order/:id/assign', assignDeliveryPartner);

export default adminRouter;
