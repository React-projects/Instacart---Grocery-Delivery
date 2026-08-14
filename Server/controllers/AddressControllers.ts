import { Request, Response } from 'express';
import { prisma } from '../Config/prisam.js';

//  get user address
//  get /api/ address
export const getAddress = async (req: Request, res: Response) => {
   const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'asc' },
   });
   return res.status(200).json({ message: 'Address fetched successfully', addresses });
};

//  Add address
//  POST /api/ address
export const createAddress = async (req: Request, res: Response) => {
   const { address, city, state, country, zip, isDefault, lat, lng, label } = req.body;
   if (lat == null || lng == null) {
      return res.status(400).json({ message: 'Location coordinates are required. Please allow location access.' });
   }
   const currentAddress = await prisma.address.findMany({
      where: { userId: req.user!.id },
   });
   let makeDefault = isDefault;
   if (currentAddress.length === 0) makeDefault = true;

   if (makeDefault) {
      await prisma.address.updateMany({
         where: { userId: req.user!.id },
         data: { isDefault: false },
      });
   }
   await prisma.address.create({
      data: {
         userId: req.user!.id,
         address,
         city,
         state,
         country,
         zip,
         isDefault: makeDefault,
         lat: Number(lat),
         lng: Number(lng),
         label,
      },
   });
   const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'asc' },
   });
   return res.status(201).json({ message: 'Address created successfully', addresses });
};

//  update address
//  PUT /api/ address/:id
export const updateAddress = async (req: Request, res: Response) => {
   const { address, city, state, country, zip, isDefault, lat, lng, label } = req.body;
   if (lat == null || lng == null) {
      return res.status(400).json({ message: 'Location coordinates are required. Please allow location access.' });
   }
   if (isDefault) {
      await prisma.address.updateMany({
         where: { userId: req.user!.id },
         data: { isDefault: false },
      });
   }

   const data: any = {};
   if (label) data.label = label;
   if (address) data.address = address;
   if (city) data.city = city;
   if (state) data.state = state;
   if (zip) data.zip = zip;
   if (isDefault !== undefined) data.isDefault = isDefault;
   if (lat !== null) data.lat = Number(lat);
   if (lng !== null) data.lng = Number(lng);

   try {
      await prisma.address.update({
         where: { id: req.params.id as string },
         data,
      });
   } catch (error) {
      return res.status(500).json({ message: 'Error updating address' });
   }
   const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'asc' },
   });
   return res.status(200).json({ message: 'Address updated successfully', addresses });
};
//  delete address
//  DELETE /api/ address/:id
export const deleteAddress = async (req: Request, res: Response) => {
   try {
      await prisma.address.delete({
         where: { id: req.params.id as string },
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error deleting address' });
   }
   const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'asc' },
   });
   return res.status(200).json({ message: 'Address deleted successfully', addresses });
};
