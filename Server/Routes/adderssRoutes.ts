import express from 'express';
import { createAddress, deleteAddress, getAddress, updateAddress } from '../controllers/AddressControllers.js';
import auth from '../middleware/Auth.js';
const addressRouter = express.Router();

addressRouter.get('/all', auth, getAddress);
addressRouter.post('/', auth, createAddress);
addressRouter.put('/:id', auth, updateAddress);
addressRouter.delete('/:id', auth, deleteAddress);

export default addressRouter;
