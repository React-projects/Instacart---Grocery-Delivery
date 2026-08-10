// Register

import { Request, Response } from 'express';
import { prisma } from '../Config/prisam.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// generate a wtf tokens
const generateToken = (id: string) => {
   return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};
//  CHECK IF USER Admin
const getAdminStatus = (email: string | null | undefined): boolean => {
   if (!email) return false;
   const adminEmails = process.env.ADMIN_EMAIL?.split(',').map((e) => e.trim().toLowerCase()) || [];
   return adminEmails.includes(email);
};
// Register
// Post/api/auth/register

export const register = async (req: Request, res: Response) => {
   const { name, email, password } = req.body;
   if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
   }
   const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
   });
   if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
   }
   const hashedPassword = await bcrypt.hash(password, 10);
   const user = await prisma.user.create({
      data: {
         name,
         email: email.toLowerCase(),
         password: hashedPassword,
      },
   });
   const token = generateToken(user.id);
   const userDate: any = {
      ...user,
   };
   delete userDate.password;
   userDate.isAdmin = getAdminStatus(userDate.email);
   res.status(201).json({ user: userDate, token });
};
// login
// Post/api/auth/login

export const LogIn = async (req: Request, res: Response) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return res.status(400).json({ message: ' email, and password are required' });
   }
   const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase(), include: { addresses: true } },
   });
   if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
   }
   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
   }
   const token = generateToken(user.id);
   const userDate: any = {
      ...user,
   };
   delete userDate.password;
   userDate.isAdmin = getAdminStatus(userDate.email);
   res.json({ user: userDate, token });
};
