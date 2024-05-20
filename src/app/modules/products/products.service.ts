import { IProduct } from './products.interface';
import { ProductModel } from './products.model';
import { Document, Types } from 'mongoose';

const validateProductId = (productId: string): void => {
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

const addAProductToDb = async (
  product: IProduct,
): Promise<IProduct & Document> => {
  const productInstance = new ProductModel(product);
  const result = await productInstance.save();
  return result;
};

const getAllProductsFromDb = async (): Promise<(IProduct & Document)[]> => {
  const result = await ProductModel.find({});
  if (result.length === 0) {
    throw new ProductNotFoundError('No products found');
  }
  return result;
};

const getASingleProductFromDb = async (
  productId: string,
): Promise<(IProduct & Document) | null> => {
  validateProductId(productId);

  const result = await ProductModel.findById(productId);
  if (!result) {
    throw new ProductNotFoundError('Product not found');
  }
  return result;
};

const updateAProduct = async (
  productId: string,
  updateData: Partial<IProduct>,
): Promise<(IProduct & Document) | null> => {
  validateProductId(productId);

  const result = await ProductModel.findOneAndUpdate(
    { _id: productId },
    updateData,
    { new: true },
  );
  if (!result) {
    throw new ProductNotFoundError('Product not found');
  }
  return result;
};

const deleteASingleProductFromDb = async (
  productId: string,
): Promise<(IProduct & Document) | null> => {
  validateProductId(productId);

  const result = await ProductModel.findByIdAndDelete(productId);
  if (!result) {
    throw new ProductNotFoundError('Product not found');
  }
  return result;
};

const getSearchedProductsFromDb = async (
  searchTerm?: string,
): Promise<IProduct[]> => {
  let query = {};
  if (searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    query = { $or: [{ name: regex }, { description: regex }] };
  }
  const result = await ProductModel.find(query);
  if (result.length === 0) {
    throw new ProductNotFoundError('No products found');
  }
  return result;
};

export const ProductService = {
  addAProductToDb,
  getAllProductsFromDb,
  getASingleProductFromDb,
  updateAProduct,
  deleteASingleProductFromDb,
  getSearchedProductsFromDb,
};
