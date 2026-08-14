import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import { prisma } from '../Config/prisam.js';

const deliveryAuth = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided authorization denied' });
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
      if (decoded.role !== 'delivery') return res.status(401).json({ message: 'access denied, you are not a delivery partner' });
      const deliveryPartner = await prisma.deliveryPartner.findUnique({
         where: { id: decoded.id },
      });
      if (!deliveryPartner || !deliveryPartner.isActive) return res.status(403).json({ message: 'account  is deactivated' });
      req.partner = deliveryPartner;
      next();
   } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: ' token in invalid', error: error.message });
   }
};

export default deliveryAuth;
