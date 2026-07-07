import dotenv from 'dotenv';

dotenv.config();

const defaultCorsOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'https://*.vercel.app',
  'https://*.netlify.app',
  'https://*.onrender.com',
];

function normalizeCorsOrigins(value) {
  return (value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '6h',
  adminUsername: process.env.ADMIN_USERNAME || 'hemraj',
  adminPassword: process.env.ADMIN_PASSWORD || 'Hardik@2025',
  corsOrigin: [...new Set([...defaultCorsOrigins, ...normalizeCorsOrigins(process.env.CORS_ORIGIN), ...normalizeCorsOrigins(process.env.FRONTEND_URL)])].join(','),
};

export function validateEnv() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is required in backend/.env');
  }
}
