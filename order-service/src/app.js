import express from 'express';
import dotenv from 'dotenv';
import orderRoutes from './routes/order.route.js';


dotenv.config();

const app = express();
app.use(express.json());


app.use('/', orderRoutes);

// basic error handler (last middleware)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log(`order-service running on port ${PORT}`);
});
