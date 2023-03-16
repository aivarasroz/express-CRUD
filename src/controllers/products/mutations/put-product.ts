import { RequestHandler } from 'express';
import ServerSetupError from 'errors/server-setup-error';
import handleRequestError from 'helpers/handle-request-error';
import ForbiddenError from 'errors/forbidden-error';
import { ProductViewModel, ProductDataBody } from '../types';
import productDataValidationSchema from '../validation-schemas/product-data-validation-schema';
import ProductModel from '../products-model/index';

const putProduct: RequestHandler<
  { id?: string },
  ProductViewModel | ErrorResponse,
  ProductDataBody,
  {}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined || req.authUser === undefined) throw new ServerSetupError();
    const productToUpdate = await ProductModel.getProduct(id);

    if (req.authUser.role !== 'ADMIN' && req.authUser.id !== productToUpdate.seller.id) {
      throw new ForbiddenError();
    }
    const productData = productDataValidationSchema.validateSync(req.body);
    const productViewModel = await ProductModel.replaceProduct(id, productData);

    res.status(200).json(productViewModel);
  } catch (err) {
    handleRequestError(err, res);
  }
};

export default putProduct;
