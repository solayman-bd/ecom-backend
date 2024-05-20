import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { ProductsRoutes } from './app/modules/products/products.route';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

const checkConnection = (req: Request, res: Response) => {
  res.json({
    message: 'Running',
  });
};
app.get('/', checkConnection);
// application routes
app.use('/api/products', ProductsRoutes);

export default app;
