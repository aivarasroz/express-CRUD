/* eslint-disable max-len */
import config from 'config';
import mysql from 'mysql2/promise';
import ProductNotFoundError from '../product-not-found-error';
import { ProductViewModel, ProductData } from '../types';
import SQL from './sql';

const getProducts = async (): Promise<ProductViewModel[]> => {
  const connection = await mysql.createConnection(config.database);

  const sql = `
  ${SQL.SELECT}
  ${SQL.GROUP}
  `;

  const [products] = await connection.query(sql);

  connection.end();

  return products as ProductViewModel[];
};

const getProduct = async (id: string): Promise<ProductViewModel> => {
  const connection = await mysql.createConnection(config.database);

  const preparedSql = `
  ${SQL.SELECT}
  where h.productId = ?
  ${SQL.GROUP}`;
  const bindings = [id];

  const [products] = await connection.query<mysql.RowDataPacket[]>(preparedSql, bindings);
  connection.end();

  if (products.length === 0) throw new ProductNotFoundError(id);

  return products[0] as ProductViewModel;
};

const deleteProduct = async (id: string): Promise<void> => {
  const connection = await mysql.createConnection(config.database);
  const preparedSql = `
    DELETE from user_product_rating
    WHERE productId = ?;
    DELETE from user_liked_product
    WHERE productId = ?;
    SET @productImagesIds = (
      select group_concat(imageId) 
      from product_image 
      where productId = ?
      group by productId);  
    DELETE from product_image
    WHERE productId = ?;
    DELETE from image
    WHERE find_in_set(imageId, @productImagesIds);
    DELETE from product
    WHERE productId = ?;`;

  const bindings = [id, id, id, id, id];
  await connection.query(preparedSql, bindings);
  connection.end();
};

const createProduct = async (productData: ProductData, userId: number): Promise<ProductViewModel> => {
  const connection = await mysql.createConnection(config.database);

  const preparedSql = `
insert into product (description, name, price, userId) values
(?, ?, ?, ?, ?);
set @created_product_id = last_insert_id();
insert into image (src) values
${productData.images.map(() => '(?)').join(',\n')};
set @first_image_id = last_insert_id();
insert into product_image(imageId, productId)
select imageId, @created_product_id as productId
from image
where imageId >= @first_image_id;
${SQL.SELECT}
where h.productId = @created_product_id
${SQL.GROUP};
`;

  const bindings = [
    productData.description,
    productData.name,
    productData.price,
    productData.quantity,
    userId,
    ...productData.images,
  ];

  const [queryResult] = await connection.query<mysql.RowDataPacket[][]>(preparedSql, bindings);
  const [product] = queryResult[queryResult.length - 1] as ProductViewModel[];

  connection.end();

  return product;
};

// eslint-disable-next-line max-len
const replaceProduct = async (productId: string, productData: ProductData): Promise<ProductViewModel> => {
  const connection = await mysql.createConnection(config.database);

  const preparedSql = `
update product
set description = ?, name= ?, price=?, quantity=?
where productId = ?;
set @productImagesIds = (
  select group_concat(imageId) 
    from product_image 
    where productId = ?
    group by productId);
delete from product_image
where productId = ?;
delete from image
where find_in_set(imageId, @productImagesIds);
insert into image (src) values
${productData.images.map(() => '(?)').join(',\n')};
set @first_image_id = last_insert_id();
insert into product_image(imageId, productId)
select imageId, ? as productId
from image
where imageId >= @first_image_id;
${SQL.SELECT}
where h.productId = ?
${SQL.GROUP};
`;

  const bindings = [
    productData.description,
    productData.name,
    productData.price,
    productData.quantity,
    productId,
    productId,
    productId,
    ...productData.images,
    productId,
    productId,
  ];

  const [queryResult] = await connection.query<mysql.RowDataPacket[][]>(preparedSql, bindings);
  const [product] = queryResult[queryResult.length - 1] as ProductViewModel[];

  connection.end();

  return product;
};

const ProductModel = {
  getProducts,
  getProduct,
  deleteProduct,
  createProduct,
  replaceProduct,
};

export default ProductModel;
