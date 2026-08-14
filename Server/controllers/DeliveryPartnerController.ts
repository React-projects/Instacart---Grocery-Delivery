import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { prisma } from '../Config/prisam.js';

// generate a wtf tokens
const generateToken = (id: string) => {
   return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};
// login DeliveryPartner
// Post/api/delivery-partner/login
export const loginDeliveryPartner = async (req: Request, res: Response) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return res.status(400).json({ message: ' email, and password are required' });
   }
   const deliveryPartner = await prisma.deliveryPartner.findUnique({
      where: { email: email.toLowerCase() },
   });
   if (!deliveryPartner) {
      return res.status(401).json({ message: 'Invalid email or password' });
   }
   if (!deliveryPartner.isActive) {
      return res.status(403).json({ message: '  deliveryPartner is not active' });
   }
   const isMatch = await bcrypt.compare(password, deliveryPartner.password);
   if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
   }
   const token = generateToken(deliveryPartner.id);
   const { password: _, ...deliveryPartnerData } = deliveryPartner;
   res.json({ deliveryPartner: deliveryPartnerData, token });
};
// get assign DeliveryPartner
// GET /api/delivery/myDelivery
export const getAssignDeliveryPartner = async (req: Request, res: Response) => {
   const { status } = req.query;
const where: any = {
   deliveryPartnerId: req.user!.id,
   NOT: [{ paymentMethod: 'card', isPaid: false }],
};
if (status === 'active') {
   where.status = {
      in: ['Assigned', 'Packed', 'Out for Delivery'],
   };
} else if (status === 'completed') where.status = { in: ['Delivered', 'Cancelled'] };

   const orders = await prisma.order.findMany({
      where,
      include: {
         user: { select: { name: true, phone: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
   });
   res.json(orders);
};

// get single DeliveryPartner
// GET /api/delivery/:id
export const getSingleDeliveryPartner = async (req: Request, res: Response) => {
   const order = await prisma.order.findFirst({
      where: {
         id: req.params.id as string,
         deliveryPartnerId: req.partner!.id,
      },
      include: {
         user: { select: { name: true, phone: true, email: true } },
      },
   });
   if (!order) {
      return res.status(404).json({ message: 'delivery not found' });
   }
   res.json(order);
};
// Complete delivery with OTP
// PUT /api/delivery/my-deliveries/:id/complete

export const completeDelivery = async (req: Request, res: Response) => {
   const { otp } = req.body;
   const order = await prisma.order.findFirst({
      where: { id: req.params.id as string, deliveryPartnerId: req.partner!.id },
   });
   if (!order || order.status === 'Cancelled' || order.status === 'Delivered') {
      return res.status(404).json({ message: 'invalid order' });
   }
   if (order.deliveryOtp !== otp) {
      return res.status(500).json({ message: 'Invalid OTP' });
   }
   const history = order.statusHistory as any[];
   history.push({
      status: 'Delivered',
      note: 'Delivered by partner',
      timestamp: new Date(),
   });
   const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
         status: 'Delivered',
         statusHistory: history,
         deliveryOtp: '',
      },
   });
   res.json({ message: 'Delivery completed successfully', order: updatedOrder });
};
// cancel delivery
// PUT /api/delivery/my-deliveries/:id/cancel

export const cancelDelivery = async (req: Request, res: Response) => {
   const { reason } = req.body;
   const order = await prisma.order.findFirst({
      where: { id: req.params.id as string, deliveryPartnerId: req.partner!.id },
   });
   if (order!.status === 'Delivered') {
      return res.status(404).json({ message: 'Order already delivered' });
   }

   const history = order!.statusHistory as any[];
   history.push({
      status: 'Cancelled',
      note: reason || '',
      timestamp: new Date(),
   });
   const updatedOrder = await prisma.order.update({
      where: { id: order!.id },
      data: {
         status: 'Cancelled',
         statusHistory: history,
         deliveryOtp: '',
      },
   });
   res.json({ message: 'Cancelled completed successfully', order: updatedOrder });
};
// update status delivery
// PUT /api/delivery/my-deliveries/:id/status

export const updateDeliveryStatus = async (req: Request, res: Response) => {
   const { status } = req.body;
   const allowStatus = ['Packed', 'Out For Delivery'];
   if (!allowStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
   }
   const order = await prisma.order.findFirst({
      where: { id: req.params.id as string, deliveryPartnerId: req.partner!.id },
   });
   const history = order!.statusHistory as any[];
   history.push({
      status,
      note: `Status updated to ${status}`,
      timestamp: new Date(),
   });
   const updatedOrder = await prisma.order.update({
      where: { id: order!.id },
      data: {
         status,
         statusHistory: history,
      },
   });
   res.json({ message: 'Status updated successfully', order: updatedOrder });
};
// update live location
// PUT /api/delivery/my-deliveries/:id/location

export const updateDeliveryLocation = async (req: Request, res: Response) => {
   const { lat, lng } = req.body;
   const order = await prisma.order.findFirst({
      where: { id: req.params.id as string, deliveryPartnerId: req.partner!.id, status: { in: ['Assign', 'Packed', 'Out for Delivery'] } },
   });
   await prisma.order.update({
      where: { id: order!.id },
      data: {
         liveLocation: {
            lat,
            lng,
            updataAt: new Date(),
         },
      },
   });

   res.json({ success: true });
};
