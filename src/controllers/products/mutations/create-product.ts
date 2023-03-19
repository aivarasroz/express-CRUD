/* eslint-disable import/extensions */
import ServerSetupError from 'errors/server-setup-error';
import { RequestHandler } from 'express';
import handleRequestError from 'helpers/handle-request-error';
import ProductModel from '../products-model';
import { ProductDataBody, ProductViewModel } from '../types';
import productDataValidationSchema from '../validation-schemas/product-data-validation-schema';

const createProduct: RequestHandler<
  {},
  ProductViewModel | ErrorResponse,
  ProductDataBody,
  {}
> = async (req, res) => {
  try {
    if (req.authUser === undefined) throw new ServerSetupError();
    const productData = productDataValidationSchema.validateSync(req.body, { abortEarly: false });

    const productViewModel = await ProductModel.createProduct(productData, req.authUser.id);

    res.status(201).json(productViewModel);
  } catch (err) {
    handleRequestError(err, res);
  }
};

export default createProduct;
