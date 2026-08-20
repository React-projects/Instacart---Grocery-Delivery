import { Request, Response } from 'express';
import { prisma } from '../Config/prisam.js';
import { inngest } from '../inngest/index.js';
import Stripe from 'stripe';

// create ORder
// Post /api/orders
export const createOrder = async (req: Request, res: Response) => {
   const { items, shippingAddress, paymentMethod } = req.body;
   if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in the order' });
   }
   // look up actual price form database
   const productIds = items.map((item: any) => item.product);

   const products = await prisma.product.findMany({
      where: {
         id: { in: productIds },
      },
   });
   const productMap: Record<string, (typeof products)[0]> = {};
   products.forEach((item) => {
      productMap[item.id] = item;
   });
   // check if product in this stock
   for (const item of items) {
      const product = productMap[item.product];
      if (!product || (product.stock ?? 0) < item.quantity) {
         return res.status(400).json({ message: 'Product is out of stock' });
      }
   }
   const ordersItems = items.map((item: any) => {
      const dbProduct = productMap[item.product];
      if (!dbProduct) throw new Error(`Product ${item.product} not found `);
      return {
         product: dbProduct.id,
         name: dbProduct.name,
         image: dbProduct.image,
         price: dbProduct.price,
         quantity: item.quantity,
         unit: dbProduct.unit,
      };
   });
   const subtotal = ordersItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
   const deliveryFee = subtotal > 20 ? 0 : 1.99;
   const tax = Math.round(subtotal * 0.08 * 100) / 100;
   const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;
   const order = await prisma.order.create({
      data: {
         userId: req.user!.id,
         items: ordersItems,
         shippingAddress,
         paymentMethod,
         subtotal,
         deliveryFee,
         tax,
         total,
         statusHistory: [
            {
               status: 'Placed',
               note: 'Order placed successfully',
               timestamp: new Date(),
            },
         ],
      },
   });
   if (paymentMethod === 'card') {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
      //    createCheckoutSession
      const session = await stripe.checkout.sessions.create({
         success_url: `${req.headers.origin}/orders?clearCart=true&session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${req.headers.origin}/checkout`,
         line_items: [
            {
               price_data: {
                  currency: 'usd',
                  product_data: {
                     name: 'payment Grocery',
                  },
                  unit_amount: Math.round(total * 100),
               },
               quantity: 1,
            },
         ],
         mode: 'payment',
         metadata: {
            orderId: order.id,
         },
      });
      return res.json({ url: session.url });
   }
   res.status(200).json({ message: 'Order created successfully', order });

   // Decrease Stock
   for (const item of ordersItems) {
      await prisma.product.update({
         where: {
            id: item.product,
         },
         data: {
            stock: {
               decrement: item.quantity,
            },
         },
      });
   }
   // Send stock update events for each product in the order
   for (const item of ordersItems) {
      await inngest.send({
         name: 'inventory/stock-update',
         data: {
            productId: item.product,
         },
      });
      await inngest.send({
         name: 'order/placed',
         data: {
            orderId: order.id,
         },
      });
   }
};

// users ORders
// Get /api/orders
export const getUsersOrder = async (req: Request, res: Response) => {
   const { status } = req.query;
   const where: any = { userId: req.user!.id, NOT: [{ paymentMethod: 'card', isPaid: false }] };

   if (status && status !== 'all') {
      where.status = status;
   }
   const order = await prisma.order.findMany({
      where,
      include: {
         deliveryPartner: { select: { name: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
   });
   res.status(200).json({ message: 'Orders fetched successfully', order });
};

// get Sniggle ORders
// Get /api/orders:id
export const getOrderById = async (req: Request, res: Response) => {
   const order = await prisma.order.findUnique({
      where: {
         id: req.params.id as string,
         userId: req.user!.id,
      },
      include: {
         deliveryPartner: { select: { name: true, phone: true, vehicleType: true, avatar: true } },
      },
   });
   if (!order) {
      return res.status(404).json({ message: 'Order not found' });
   }
   return res.status(200).json({ message: 'Order fetched successfully', order });
};

// update order status (Admin)
// post /api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response) => {
   const { status, note } = req.body;
   const order = await prisma.order.findUnique({
      where: {
         id: req.params.id as string,
      },
   });
   if (!order) {
      return res.status(404).json({ message: 'Order not found' });
   }
   const history = (Array.isArray(order.statusHistory) ? order.statusHistory : []) as any[];
   history.push({ status, note: note || ` Order status updated to ${status.toLowerCase()}`, timestamp: new Date() });

   const updatedOrder = await prisma.order.update({
      where: {
         id: req.params.id as string,
      },
      include: {
         deliveryPartner: { select: { name: true, phone: true } },
         //    orderBy: { createdAt: 'desc' },
      },

      data: {
         status,
         statusHistory: history,
      },
   });
   res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
};

// Get all orders (Admin)
// get /api/orders/all
export const getAllOrders = async (req: Request, res: Response) => {
   const orders = await prisma.order.findMany({
      where: { NOT: [{ paymentMethod: 'card', isPaid: false }] },
      include: {
         user: { select: { name: true, phone: true } },
         deliveryPartner: { select: { name: true, phone: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
   });
   res.status(200).json({
      message: 'Orders fetched successfully',
      orders,
   });
};

// Get  orders location (Admin)
// get /api/orders/:id/location
export const getOrderLocation = async (req: Request, res: Response) => {
   const order = await prisma.order.findFirst({
      where: {
         id: req.params.id as string,
         userId: req.user!.id,
         select: { LiveLocation: true, status: true },
      },
   });
   if (!order) {
      return res.status(404).json({ message: 'Order not found' });
   }
   res.status(200).json({ message: 'Order location fetched successfully', liveLocation: order.liveLocation, status: order.status });
};

// Verify Stripe Checkout Session
// POST /api/orders/verify-stripe
export const verifyStripePayment = async (req: Request, res: Response) => {
   const { sessionId } = req.body;
   if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
   }

   try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid' && session.metadata?.orderId) {
         const orderId = session.metadata.orderId;
         const order = await prisma.order.findUnique({
            where: { id: orderId },
         });

         if (!order) {
            return res.status(404).json({ message: 'Order not found' });
         }

         if (order.isPaid) {
            return res.status(200).json({ message: 'Order already verified', order });
         }

         const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { isPaid: true },
         });

         const ordersItems = (Array.isArray(updatedOrder.items) ? updatedOrder.items : []) as any[];

         // Decrease Stock
         for (const item of ordersItems) {
            if (item.product) {
               await prisma.product.update({
                  where: { id: item.product },
                  data: {
                     stock: {
                        decrement: item.quantity,
                     },
                  },
               });
            }
         }

         // Trigger inngest
         try {
            await inngest.send({ name: 'order/placed', data: { orderId: updatedOrder.id } });
            for (const item of ordersItems) {
               if (item.product) {
                  await inngest.send({
                     name: 'inventory/stock-update',
                     data: { productId: item.product },
                  });
               }
            }
         } catch (inngestError) {
            console.error('Inngest dispatch error:', inngestError);
         }

         return res.status(200).json({ message: 'Payment verified successfully', order: updatedOrder });
      }

      return res.status(400).json({ message: 'Payment not completed or invalid session' });
   } catch (error: any) {
      console.error('Error verifying Stripe payment:', error);
      return res.status(500).json({ message: error.message || 'Payment verification failed' });
   }
};
