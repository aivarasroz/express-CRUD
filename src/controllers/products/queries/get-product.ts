import { RequestHandler } from 'express';
import ServerSetupError from 'errors/server-setup-error';
import handleRequestError from 'helpers/handle-request-error';
import { ProductViewModel } from '../types';
import ProductModel from '../products-model';

const getProduct: RequestHandler<
  { id?: string },
  ProductViewModel | ErrorResponse,
  undefined,
  {}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined) throw new ServerSetupError();
    const productViewModel = await ProductModel.getProduct(id);

    res.json(productViewModel);
  } catch (err) {
    handleRequestError(err, res);
  }
};

export default getProduct;
