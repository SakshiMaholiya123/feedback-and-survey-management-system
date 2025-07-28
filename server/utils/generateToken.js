// backend/utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '365d', // 🔐 Valid for 1 year
  });
};

export default generateToken;
