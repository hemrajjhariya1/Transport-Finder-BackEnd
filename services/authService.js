import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const ADMIN_USERNAME = env.adminUsername;
const ADMIN_PASSWORD = env.adminPassword;
const JWT_SECRET = env.jwtSecret;
const JWT_EXPIRES_IN = env.jwtExpiresIn;

export async function loginAdmin(username, password) {
  if (!username || !password) return null;
  const isValid =
    username.toLowerCase() === ADMIN_USERNAME.toLowerCase() && password === ADMIN_PASSWORD;
  if (!isValid) return null;

  const token = jwt.sign({ username: ADMIN_USERNAME, role: 'admin' }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    admin: { username: ADMIN_USERNAME },
    token,
  };
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
