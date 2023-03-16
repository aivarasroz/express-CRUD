import * as yup from 'yup';
import { RegistrationBody } from '../types';

const sellerRegistrationBodyValidationSchema: yup.ObjectSchema<RegistrationBody> = yup.object({

  name: yup.string()
  .required('name is required')
  .min(2, 'name must have at least 2 letters')
  .max(32, 'name can\'t have more than 32 letters'),

  email: yup.string()
    .required('email is required')
    .email('incorrect email format'),

  password: yup.string()
    .required('password is required')
    .min(8, 'password must have at least 8 symbols')
    .max(32, 'password can\'t have more than 32 symbols')
    .matches(/[A-Z]{1}/, 'password must have at least one upper case letter')
    .matches(/[a-z]{1}/, 'password must have at least one lower case letter')
    .matches(/[0-9]{1}/, 'password must have at least one number')
    .matches(/[#?!@$%^&*-]{1}/, 'password must have at least one special character'),

  passwordConfirmation: yup.string()
    .required('password confirmation is required')
    .oneOf([yup.ref('password')], 'passwords do not match'),

}).strict(true);

export default sellerRegistrationBodyValidationSchema;
