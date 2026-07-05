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

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
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

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
