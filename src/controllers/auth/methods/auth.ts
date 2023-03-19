import { RequestHandler } from 'express';

export const auth: RequestHandler = (req, res) => {
  res.send('duomenu atnaujinimas');
};
