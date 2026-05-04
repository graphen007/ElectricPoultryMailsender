import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import venueRoutes from './routes/venues';
import gigRoutes from './routes/gigs';
import emailRoutes from './routes/email';
import templateRoutes from './routes/templates';

dotenv.config();

// Fix for OpenSSL 3.x TLS compatibility with MongoDB Atlas on Node 18
if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve public assets (e.g. images)
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/venues', venueRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/templates', templateRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Electric Poultry API running' });
});

// Serve React SPA — must come after all API routes
const frontendDist = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
