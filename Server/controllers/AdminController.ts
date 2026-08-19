import { Request, Response } from 'express';
import { prisma } from '../Config/prisam.js';
import bcrypt from 'bcrypt';

// get ADmin dashboard DAta
//  CHECK IF USER Admin
export const getAdminState = async (req: Request, res: Response) => {
   const [totalOrders, totalUsers, totalProducts, outOfStock, totalPartners, recentOrders] = await Promise.all([
      prisma.order.count({ where: { NOT: [{ paymentMethod: 'card', isPaid: false }] } }),
      prisma.user.count(),
      prisma.product.count(),
      prisma.product.count({ where: { stock: 0 } }),
      prisma.deliveryPartner.count(),
      prisma.order.findMany({
         where: { NOT: [{ paymentMethod: 'card', isPaid: false }] },
         take: 8,
         orderBy: { createdAt: 'desc' },
         include: { user: { select: { name: true, email: true } }, deliveryPartner: { select: { name: true, phone: true } } },
      }),
   ]);
   res.json({ totalOrders, totalUsers, totalProducts, outOfStock, totalPartners, recentOrders });
};

// get deliveryPartners Form Admin
export const getDeliveryPartners = async (req: Request, res: Response) => {
   const parents = await prisma.deliveryPartner.findMany({ orderBy: { createdAt: 'desc' } });

   res.json(parents);
};

// create deliveryPartners Form Admin
export const createDeliveryPartner = async (req: Request, res: Response) => {
   const { name, email, phone, password, vehicleType } = req.body;
   if (!name || !email || !phone || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
   }
   const hashedPassword = await bcrypt.hash(password, 10);
   const deliveryPartner = await prisma.deliveryPartner.create({
      data: {
         name,
         email: email.toLowerCase(),
         phone,
         password: hashedPassword,
         vehicleType,
      },
   });
   res.status(201).json(deliveryPartner);
};

// create deliveryPartners Form Admin
export const updateDeliveryPartner = async (req: Request, res: Response) => {
   const { name, phone, vehicleType, isActive } = req.body;
   const data: any = {};
   if (name) data.name = name;
   if (phone) data.phone = phone;
   if (vehicleType) data.vehicleType = vehicleType;
    data.isActive = isActive;

   try {
      const deliveryPartner = await prisma.deliveryPartner.update({
         where: {
            id: req.params.id as string,
         },
         data,
      });
      res.status(201).json(deliveryPartner);
   } catch (error) {
      console.log(error);
      res.status(404).json({ message: 'Partner not found' });
   }
};

// assign deliveryPartners Form Admin
export const assignDeliveryPartner = async (req: Request, res: Response) => {
   const { partnerId } = req.body;
   const order = await prisma.order.findUnique({
      where: {
         id: req.params.id as string,
      },
   });
   if (!order) {
      return res.status(404).json({ message: 'Order not found' });
   }

   const deliveryPartner = await prisma.deliveryPartner.findUnique({
      where: {
         id: partnerId as string,
      },
   });
   if (!deliveryPartner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
   }

   const otp = String(Math.floor(100000 + Math.random() * 900000));
   const status = 'Assigned';
   const history = (Array.isArray(order!.statusHistory) ? order!.statusHistory : []) as any[];
   history.push({
      status,
      note: `Assigned to ${deliveryPartner.name}`,
      timestamp: new Date(),
   });

   const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
         deliveryPartnerId: deliveryPartner.id,
         deliveryOtp: otp,
         status,
         statusHistory: history,
      },
      include: {
         deliveryPartner: { select: { name: true, phone: true, email: true } },
      },
   });

   res.status(200).json({ message: 'Order assigned successfully', order: updatedOrder });
};
