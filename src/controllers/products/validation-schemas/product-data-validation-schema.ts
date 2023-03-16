import * as yup from 'yup';
import { ProductData } from '../types';

const productDataValidationSchema: yup.ObjectSchema<ProductData> = yup.object({
  name: yup.string()
    .required('name is required')
    .min(2, 'name must have at least 2 letters')
    .max(32, 'name can\'t have more than 32 letters'),

  description: yup.string()
    .required('description is required')
    .min(10, 'description must have at least 10 letters')
    .max(256, 'description can\'t have more than 256 letters'),

  quantity: yup.number()
    .required('quantity is required')
    .positive('quantity must be positive')
    .integer('quantity must be an integer'),

  images: yup
    .array(yup.string().required().url('image must be accessible'))
    .min(1, 'at least one image required')
    .required('images are required'),

  price: yup.string()
    .required('price is required')
    .matches(/^\d+(\.\d{1,2})?$/, 'price must be a valid decimal number with up to 2 decimal places'),

  rating: yup.number()
    .min(0, 'rating must be a non-negative number')
    .max(5, 'rating can\'t be greater than 5')
    .nullable(),

  seller: yup.object({
    name: yup.string().required('seller name is required'),
    email: yup.string().email('seller email must be valid').required('seller email is required'),
  }).required('seller info is required'),
}).strict(true);

export default productDataValidationSchema;
