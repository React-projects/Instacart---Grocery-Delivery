import express from 'express';
import { createProduct, deleteProduct, getFlashDeals, getProducts, getProductsById, UpdateProduct } from '../controllers/ProductsController.js';
import auth from '../middleware/Auth.js';
import admin from '../middleware/Admin.js';
const productRouter = express.Router();

productRouter.get('/flash-deals', getFlashDeals);
productRouter.get('/', getProducts);
productRouter.get('/:id', getProductsById);
productRouter.post('/', auth, admin, createProduct);
productRouter.put('/:id', auth, admin, UpdateProduct);
productRouter.delete('/:id', auth, admin, deleteProduct);

export default productRouter;
