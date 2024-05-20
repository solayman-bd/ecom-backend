import { IOrderRequest } from './order.interference';
import { Schema, model } from 'mongoose';

const OrderRequestSchema = new Schema<IOrderRequest>({
  email: { type: String, required: true },
  productId: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});
export const OrderModel = model<IOrderRequest>('Order', OrderRequestSchema);
