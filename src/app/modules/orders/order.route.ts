import express from 'express';
import { orderController } from './order.controller';

const router = express.Router();

router.post('/', orderController.createANewOrder);
router.get('/', orderController.getAllOrdersFromDb);

export const OrderRoutes = router;
