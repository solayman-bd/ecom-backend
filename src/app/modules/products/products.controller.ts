import { Request, Response } from 'express';
import { productValidationSchema } from './product.validator';
import { ProductNotFoundError, ProductService } from './products.service';
import { ValidationError } from 'joi';

const handleErrorResponse = (res: Response, error: unknown): void => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
    error: errorMessage,
  });
};

const handleNotFoundError = (
  res: Response,
  error: ProductNotFoundError,
): void => {
  res.status(404).json({
    success: false,
    message: error.message,
  });
};

const handleSuccessResponse = (
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

const validateProductData = (productData: any): ValidationError | null => {
  const { error } = productValidationSchema.validate(productData);
  return error || null;
};

const addProductToDb = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body;
    const validationError = validateProductData(productData);
    if (validationError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationError.details.map((err) => err.message),
      });
      return;
    }

    const result = await ProductService.addAProductToDb(productData);
    handleSuccessResponse(res, 'Product is created successfully', result);
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      handleNotFoundError(res, error);
    } else {
      handleErrorResponse(res, error);
    }
  }
};

const getAllProductsFromDb = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const searchTerm = (req.query.searchTerm as string) || '';
    const result = searchTerm
      ? await ProductService.getSearchedProductsFromDb(searchTerm)
      : await ProductService.getAllProductsFromDb();
    handleSuccessResponse(res, 'Products fetched successfully', result);
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      handleNotFoundError(res, error);
    } else {
      handleErrorResponse(res, error);
    }
  }
};

const getASingleProductFromDb = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.productId;
    const result = await ProductService.getASingleProductFromDb(id);
    handleSuccessResponse(res, 'Product fetched successfully!', result);
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      handleNotFoundError(res, error);
    } else {
      handleErrorResponse(res, error);
    }
  }
};

const updateAProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.productId;
    const updatedData = req.body;

    const result = await ProductService.updateAProduct(id, updatedData);
    handleSuccessResponse(res, 'Product updated successfully!', result);
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      handleNotFoundError(res, error);
    } else {
      handleErrorResponse(res, error);
    }
  }
};

const deleteASingleProductFromDb = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.productId;
    await ProductService.deleteASingleProductFromDb(id);
    handleSuccessResponse(res, 'Product deleted successfully!', null);
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      handleNotFoundError(res, error);
    } else {
      handleErrorResponse(res, error);
    }
  }
};

export const productController = {
  addProductToDb,
  getAllProductsFromDb,
  getASingleProductFromDb,
  updateAProduct,
  deleteASingleProductFromDb,
};
