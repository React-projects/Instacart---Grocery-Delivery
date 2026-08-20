import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../Config/prisam.js';
import { inngest } from '../inngest/index.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;

export const stripeWebhooks = async (request: Request, response: Response) => {
   let event;
   if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers['stripe-signature'];
      try {
         event = stripe.webhooks.constructEvent(request.body, signature as string, endpointSecret);
      } catch (err: any) {
         console.log(`⚠️ Webhook signature verification failed.`, err.message);
         return response.sendStatus(400);
      }

      // Handle the event
      switch (event.type) {
         // ✅ 1. Payment Success in Stripe Checkout
         case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId = session.metadata?.orderId;

            if (orderId && session.payment_status === 'paid') {
               const paymentOrder = await prisma.order.update({
                  where: { id: orderId },
                  data: { isPaid: true },
               });

               const ordersItems = (Array.isArray(paymentOrder.items) ? paymentOrder.items : []) as any[];
               for (const item of ordersItems) {
                  await prisma.product.update({
                     where: { id: item.product },
                     data: {
                        stock: {
                           decrement: item.quantity,
                        },
                     },
                  });
               }

               if (paymentOrder) {
                  await inngest.send({ name: 'order/placed', data: { orderId } });
               }

               for (const item of ordersItems) {
                  await inngest.send({
                     name: 'inventory/stock-update',
                     data: {
                        productId: item.product,
                     },
                  });
               }
            }
            break;
         }

         // ✅ 2. Payment Intent Success fallback
         case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const paymentIntentId = paymentIntent.id;

            // get session metadata
            const session = await stripe.checkout.sessions.list({
               payment_intent: paymentIntentId,
            });

            const orderId = session.data?.[0]?.metadata?.orderId;
            if (orderId) {
               const paymentOrder = await prisma.order.update({
                  where: { id: orderId },
                  data: { isPaid: true },
               });

               const ordersItems = (Array.isArray(paymentOrder.items) ? paymentOrder.items : []) as any[];
               for (const item of ordersItems) {
                  await prisma.product.update({
                     where: { id: item.product },
                     data: {
                        stock: {
                           decrement: item.quantity,
                        },
                     },
                  });
               }

               if (paymentOrder) {
                  await inngest.send({ name: 'order/placed', data: { orderId } });
               }

               for (const item of ordersItems) {
                  await inngest.send({
                     name: 'inventory/stock-update',
                     data: {
                        productId: item.product,
                     },
                  });
               }
            }
            break;
         }

         // ❌ 3. Cancelled / Failed / Expired payments
         case 'checkout.session.expired': {
            const session = event.data.object as Stripe.Checkout.Session;
            const failedId = session.metadata?.orderId;
            if (failedId) {
               await prisma.order.delete({
                  where: { id: failedId },
               }).catch(() => {});
            }
            break;
         }

         case 'payment_intent.canceled':
         case 'payment_intent.payment_failed': {
            const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
            const paymentIntentFailedId = paymentIntentFailed.id;

            const sessionFailed = await stripe.checkout.sessions.list({
               payment_intent: paymentIntentFailedId,
            });

            const failedId = sessionFailed.data?.[0]?.metadata?.orderId;
            if (failedId) {
               await prisma.order.delete({
                  where: { id: failedId },
               }).catch(() => {});
            }
            break;
         }

         default:
            console.log(`Unhandled event type ${event.type}`);
      }

      // Return a response to acknowledge receipt of the event
      response.json({ received: true });
   } else {
      console.warn('⚠️ STRIPE_WEBHOOK_SECRET_KEY is not defined.');
      response.status(400).send('Webhook secret is not defined');
   }
};
