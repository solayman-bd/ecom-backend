import { Types } from 'mongoose';
import { Request, Response } from 'express';
export const validateProductId = (productId: string): void => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new Error('Invalid product ID');
  }
};

export class ProductNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductNotFoundError';
  }
}
export const handleErrorResponse = (res: Response, error: unknown): void => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
    error: errorMessage,
  });
};

export const handleNotFoundError = (
  res: Response,
  error: ProductNotFoundError,
): void => {
  res.status(404).json({
    success: false,
    message: error.message,
  });
};

export const handleSuccessResponse = (
  res: Response,
  message: string,
  data: any,
): void => {
  res.status(200).json({
    success: true,
    message,
    data,
  });
};
