import { Request, Response } from 'express';
import { IOrderRequest } from './order.interference';
import { orderService } from './order.service';
import { ValidationError } from 'joi';
import { Document } from 'mongoose';
import {
  ProductNotFoundError,
  handleErrorResponse,
  handleNotFoundError,
  handleSuccessResponse,
} from '../../config/helper';
import { orderRequestValidatorSchema } from './order.validator';
import { ProductService } from '../products/products.service';
import { IProduct } from '../products/products.interface';

const validateOrderData = (productData: any): ValidationError | null => {
  const { error } = orderRequestValidatorSchema.validate(productData);
  return error || null;
};

const createANewOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: IOrderRequest = req.body;
    const validationError = validateOrderData(data);
    if (validationError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationError.details.map((err) => err.message),
      });
      return;
    } else {
      const productId = data.productId;
      const productInfo =
        await ProductService.getASingleProductFromDb(productId);
      const availableQuantity = (productInfo as IProduct & Document).inventory
        .quantity;
      if (availableQuantity != 0 && availableQuantity >= data.quantity) {
        const result = await orderService.createANewOrder(data);
        const updateData = {
          inventory: {
            quantity: availableQuantity - data.quantity,
            inStock: availableQuantity - data.quantity > 0,
          },
        };

        await ProductService.updateAProduct(productId, updateData);
        handleSuccessResponse(res, 'Order created successfully!', result);
      } else {
        res.status(409).json({
          success: false,
          message: 'Insufficient quantity available in inventory',
        });
      }
    }
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const getAllOrdersFromDb = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const searchTerm = (req.query.email as string) || '';
    const result = searchTerm
      ? await orderService.getOrdersByEmail(searchTerm)
      : await orderService.getAllOrders();
    handleSuccessResponse(res, 'Orders fetched successfully', result);
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      handleNotFoundError(res, error);
    } else {
      handleErrorResponse(res, error);
    }
  }
};

export const orderController = {
  createANewOrder,
  getAllOrdersFromDb,
};
