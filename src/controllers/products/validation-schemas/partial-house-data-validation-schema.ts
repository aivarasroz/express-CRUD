import * as yup from 'yup';
import { PartialProductData } from '../types';

const partialProductDataValidationSchema: yup.ObjectSchema<PartialProductData> = yup.object({
  name: yup.string()
    .min(2, 'name must have at least 2 letters')
    .max(32, 'name can\'t have more than 32 letters'),

  description: yup.string()
    .max(200, 'description can\'t have more than 200 letters'),

  price: yup.number()
    .positive('price must be positive')
    .test(
      'priceFormat',
      'price can\'t have more than 2 decimal points',
      (value) => value === undefined || Number(value.toFixed(2)) === value,
    ),

  quantity: yup.number()
    .positive('quantity must be positive')
    .integer('quantity must be an integer'),

  images: yup
    .array(yup.string().required().url('image must be accessible')),

  seller: yup.object({
    name: yup.string(),
    email: yup.string().email('invalid email address'),
  }),
}).strict(true);

export default partialProductDataValidationSchema;
