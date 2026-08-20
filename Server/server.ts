import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import authRouter from './Routes/authRoutes.js';
import productRouter from './Routes/productRotes.js';
import uploadRouter from './Routes/uploadRoutes.js';
import orderRouter from './Routes/orderRoutes.js';
import { serve } from 'inngest/express';
import { inngest, functions } from './inngest/index.js';
import addressRouter from './Routes/adderssRoutes.js';
import adminRouter from './Routes/adminRoutes.js';
import deliveryPartnerRouter from './Routes/deliveryPartnerRoutes.js';
import { stripeWebhooks } from './controllers/webhooks.js';

const app = express();
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// Middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
   res.send('Server is Live!');
});
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/orders', orderRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/admin', adminRouter);
app.use('/api/delivery', deliveryPartnerRouter);
// Inngest server
app.use('/api/inngest', serve({ client: inngest, functions }));


// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
   console.error(err);
   res.status(500).json({ massage: err.message });
});

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
