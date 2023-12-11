import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const secretKey = process.env.SECRETKEY || '';

export const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
