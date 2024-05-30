// lib/jwt.js

import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export const signToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: '1h' }); // Adjust the expiresIn value as needed
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
