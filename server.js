import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import transporterRoutes from './routes/transporterRoutes.js';
import cityRoutes from './routes/cityRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

await connectDb();

const app = express();
const port = env.port;

const allowedOrigins = env.corsOrigin
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes('*')) return true;

  return allowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin === origin) return true;

    const escapedOrigin = escapeRegExp(allowedOrigin).replace(/\\\*/g, '.*');
    return new RegExp(`^${escapedOrigin}$`, 'i').test(origin);
  });
}

const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Transport Finder backend is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/transporters', transporterRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error.',
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend running on http://0.0.0.0:${port}`);
});
