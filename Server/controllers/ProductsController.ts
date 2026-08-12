import { Request, Response } from 'express';
import { prisma } from '../Config/prisam.js';

//  Get api/products/flashDeals
export const getFlashDeals = async (req: Request, res: Response) => {
   const products = await prisma.product.findMany({
      where: {
         stock: {
            gt: 0,
         },
         orderBy: {
            originalPrice: 'desc',
         },
      },
   });

   const productsWithDiscount = products.map((product: any) => {
      const discount = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
      return {
         ...product,
         discount,
      };
   });
   res.json({
      products: productsWithDiscount.slice(0, 8),
   });
};

//  Get api/products
export const getProducts = async (req: Request, res: Response) => {
   const { category, search, minprice, maxprice, sort } = req.query;
   const where: any = {};
   if (category && category !== 'all') where.category = category as string;
   if (search) where.name = { contains: search as string, mode: 'insensitive' };
   if (minprice && maxprice) {
      where.price = {};
      if (minprice) where.price.gte = Number(minprice);
      if (maxprice) where.price.lte = Number(maxprice);
   }
   const orderBy: any = {};
   if (sort === 'price-low') orderBy.price = 'asc';
   else if (sort === 'price-high') orderBy.price = 'desc';
   else orderBy.createdAt = 'desc';
   const products = await prisma.product.findMany({
      where,
      orderBy,
   });
   const productsWithDiscount = products.map((product: any) => {
      const discount = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
      return {
         ...product,
         discount,
      };
   });
   res.json({
      products: productsWithDiscount,
   });
};

//  Get api/products/:id
export const getProductsById = async (req: Request, res: Response) => {
   const product = await prisma.product.findUnique({
      where: {
         id: req.params.id as string,
      },
   });
   if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
   }
   const discount = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
   res.json({
      product: {
         ...product,
         discount,
      },
   });
};

//  Post api/products

export const createProduct = async (req: Request, res: Response) => {
   const product = await prisma.product.create({
      data: req.body,
   });
   res.status(201).json(product);
};
//  put api/products/:id

export const UpdateProduct = async (req: Request, res: Response) => {
   const product = await prisma.product.update({
      where: {
         id: req.params.id as string,
      },
      data: req.body,
   });
   res.json(product);
};
//  put api/products/:id

export const deleteProduct = async (req: Request, res: Response) => {
   const product = await prisma.product.delete({
      where: {
         id: req.params.id as string,
      },
   });
   res.json({ massage: 'Product deleted successfully' });
};
