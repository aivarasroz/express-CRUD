import NotFoundError from 'errors/not-found-error';

class ProductNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Product with id '${id}' was not found`);
  }
}

export default ProductNotFoundError;
