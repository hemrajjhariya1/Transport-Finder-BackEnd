import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '6h',
  adminUsername: process.env.ADMIN_USERNAME || 'hemraj',
  adminPassword: process.env.ADMIN_PASSWORD || 'Hardik@2025',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

export function validateEnv() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is required in backend/.env');
  }
}
