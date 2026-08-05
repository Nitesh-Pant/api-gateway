// src/app.js
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/', userRoutes);

// basic error handler (last middleware)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`user-service running on port ${PORT}`);
});
