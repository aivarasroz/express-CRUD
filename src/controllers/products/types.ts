export type ProductViewModel = {
  id: number,
  name: string,
  description: string,
  seller: {
    id: number,
    name: string,
    email: string,
  },
  price: string,
  quantity: number,
  images: string[],
  rating?: number
};

export type ProductData = Omit<ProductViewModel, 'id' | 'seller' | 'rating'> & {
};

export type PartialProductData = Partial<ProductData>;

export type ProductDataBody = PartialRecursive<ProductData>;
