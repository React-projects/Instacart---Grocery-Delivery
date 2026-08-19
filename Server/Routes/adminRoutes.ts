import express from 'express';
import { assignDeliveryPartner, createDeliveryPartner, getAdminState, getDeliveryPartners, updateDeliveryPartner } from '../controllers/AdminController.js';
const adminRouter = express.Router();

adminRouter.get('/stats', getAdminState);
adminRouter.get('/delivery-partners', getDeliveryPartners);
adminRouter.post('/delivery-partners', createDeliveryPartner);
adminRouter.put('/delivery-partner/:id', updateDeliveryPartner);
adminRouter.put('/orders/:id/assign', assignDeliveryPartner);

export default adminRouter;
