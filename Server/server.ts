import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import authRouter from './Routes/authRoutes.js';
import productRouter from './Routes/productRotes.js';
import uploadRouter from './Routes/uploadRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
   res.send('Server is Live!');
});
app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/upload', uploadRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
   console.error(err);
   res.status(500).json({ massage: err.message });
});

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
