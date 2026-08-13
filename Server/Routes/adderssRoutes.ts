import express from 'express';
import { createAddress, deleteAddress, getAddress, updateAddress } from '../controllers/AddressControllers.js';
const addressRouter = express.Router();

addressRouter.get('/all', getAddress);
addressRouter.post('/', createAddress);
addressRouter.put('/:id', updateAddress);
addressRouter.delete('/:id', deleteAddress);

export default addressRouter;
