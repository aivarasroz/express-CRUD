import { RequestHandler } from 'express';
import ProductModel from '../products-model';
import { ProductViewModel } from '../types';

const getProducts: RequestHandler<
  {},
  ProductViewModel[],
  undefined,
  {}
> = async (req, res) => {
  const productViewModelArray = await ProductModel.getProducts();
  res.json(productViewModelArray);
};

export default getProducts;
