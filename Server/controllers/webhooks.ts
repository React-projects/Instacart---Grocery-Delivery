import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../Config/prisam.js';
import { inngest } from '../inngest/index.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;

export const stripeWebhooks = async (req: Request, res: Response) => {
   let event;
   if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers['stripe-signature'];
      try {
         event = stripe.webhooks.constructEvent(request.body, signature as string, endpointSecret);
      } catch (err) {
         console.log(`⚠️ Webhook signature verification failed.`, err.message);
         return response.sendStatus(400);
      }

      // Handle the event
      switch (event.type) {
         case 'payment_intent.succeeded':
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const paymentIntentId = paymentIntent.id;

            //  get session meta data
            const session = await stripe.checkout.sessions.list({
               payment_intent: paymentIntentId,
            });
            const { orderId } = session.data[0].metadata as any;
            //   make order it is paid
            const paymentOder = await prisma.order.update({
               where: {
                  id: orderId,
               },
               data: {
                  isPaid: true,
               },
            });
            const ordersItems = (Array.isArray(paymentOder.items) ? paymentOder.items : []) as any[];
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
            if (paymentOder) {
               await inngest.send({ name: 'order/placed', data: { orderId } });
            }
            // Send stock update events for each product in the order
            for (const item of ordersItems) {
               await inngest.send({
                  name: 'inventory/stock-update',
                  data: {
                     productId: item.product,
                  },
               });
            }
            break;
         case 'payment_intent.canceled':
         case 'payment_intent.payment_failed': {
            const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
            const paymentIntentFailedId = paymentIntentFailed.id;
            //   get session meta data
            const sessionFailed = await stripe.checkout.sessions.list({
               payment_intent: paymentIntentFailedId,
            });
            const failedId = (sessionFailed.data[0].metadata as any).orderId;
            await prisma.order.delete({
               where: {
                  id: failedId,
               },
            });
            break;
         }
         default:
            console.log(`Unhandled event type ${event.type}`);
      }
      // Return a response to acknowledge receipt of the event
      response.json({ received: true });
   }
};
