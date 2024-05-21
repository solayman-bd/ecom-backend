import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { ProductsRoutes } from './app/modules/products/products.route';
import { OrderRoutes } from './app/modules/orders/order.route';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cors());

const checkConnection = (req: Request, res: Response) => {
  res.json({
    message: 'Server is Running Successfully',
  });
};
app.get('/', checkConnection);
// application routes
app.use('/api/products', ProductsRoutes);
app.use('/api/orders', OrderRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;
