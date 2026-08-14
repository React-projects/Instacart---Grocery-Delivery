import express from 'express';
import {
   cancelDelivery,
   completeDelivery,
   getAssignDeliveryPartner,
   getSingleDeliveryPartner,
   loginDeliveryPartner,
   updateDeliveryLocation,
   updateDeliveryStatus,
} from '../controllers/DeliveryPartnerController.js';
import deliveryAuth from '../middleware/DeliveryAuth.js';
const deliveryPartnerRouter = express.Router();

deliveryPartnerRouter.post('/login', loginDeliveryPartner);
deliveryPartnerRouter.get('/my-deliveries', deliveryAuth, getAssignDeliveryPartner);
deliveryPartnerRouter.get('/my-deliveries/:id', deliveryAuth, getSingleDeliveryPartner);
deliveryPartnerRouter.put('/my-deliveries/:id/complete', deliveryAuth, completeDelivery);
deliveryPartnerRouter.put('/my-deliveries/:id/cancel', deliveryAuth, cancelDelivery);
deliveryPartnerRouter.put('/my-deliveries/:id/status', deliveryAuth, updateDeliveryStatus);
deliveryPartnerRouter.put('/my-deliveries/:id/location', deliveryAuth, updateDeliveryLocation);

export default deliveryPartnerRouter;
