import jwt from 'jsonwebtoken';


const SECRET = process.env.JWT_SECRET

export const authMiddleware = (req) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};
