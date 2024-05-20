import { ProductNotFoundError } from '../../config/helper';
import { ProductModel } from '../products/products.model';
import { IOrderRequest } from './order.interference';
import { OrderModel } from './order.model';
import { Document } from 'mongoose';

const createANewOrder = async (
  orderData: IOrderRequest,
): Promise<IOrderRequest & Document> => {
  const resultInstance = new OrderModel(orderData);
  const result = await resultInstance.save();
  return result.toObject({ versionKey: false });
};

const getAllOrders = async (): Promise<(IOrderRequest & Document)[]> => {
  const result = await OrderModel.find({}).select('-__v');
  if (result.length === 0) {
    throw new ProductNotFoundError('No products found');
  }
  return result;
};
const getOrdersByEmail = async (
  searchTerm: string,
): Promise<IOrderRequest[]> => {
  const result = await OrderModel.find({ email: searchTerm });
  if (result.length === 0) {
    throw new ProductNotFoundError(
      `No order found by this email : ${searchTerm}`,
    );
  }
  return result;
};
export const orderService = {
  createANewOrder,
  getAllOrders,
  getOrdersByEmail,
};
