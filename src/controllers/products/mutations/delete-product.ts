import { RequestHandler } from 'express';
import ServerSetupError from 'errors/server-setup-error';
import handleRequestError from 'helpers/handle-request-error';
import ForbiddenError from 'errors/forbidden-error';
import { ProductViewModel } from '../types';
import ProductModel from '../products-model';

const deleteProduct: RequestHandler<
  { id?: string },
  ProductViewModel | ErrorResponse,
  {},
  {}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined || req.authUser === undefined) throw new ServerSetupError();
    const productViewModel = await ProductModel.getProduct(id);

    if (req.authUser.role !== 'ADMIN' && req.authUser.id !== productViewModel.seller.id) {
      throw new ForbiddenError();
    }

    await ProductModel.deleteProduct(id);

    res.status(200).json(productViewModel);
  } catch (err) {
    handleRequestError(err, res);
  }
};

export default deleteProduct;
