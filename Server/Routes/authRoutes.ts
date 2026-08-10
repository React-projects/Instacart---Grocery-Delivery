import express from 'express';
import { LogIn, register } from '../controllers/AuthController.js';
const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', LogIn);

export default authRouter;
