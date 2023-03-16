import express from 'express';
import jwtTokenMiddleware from 'middlewares/jwt-token-middleware';
import getProducts from './queries/get-products';
import getProduct from './queries/get-product';
import createProduct from './mutations/create-product';
import deleteProduct from './mutations/delete-product';
import putProduct from './mutations/put-product';

const productsController = express.Router();

productsController.get('/', getProducts);
productsController.get('/:id', getProduct);

productsController.post('/', jwtTokenMiddleware, createProduct);
productsController.put('/:id', jwtTokenMiddleware, putProduct);
productsController.delete('/:id', jwtTokenMiddleware, deleteProduct);

export default productsController;
