import {
  RequestedItemNotFoundError,
  validateProductId,
} from '../../config/helper';
import { IProduct } from './products.interface';
import { ProductModel } from './products.model';
import { Document } from 'mongoose';

const addAProductToDb = async (
  product: IProduct,
): Promise<IProduct & Document> => {
  const productInstance = new ProductModel(product);
  const result = await productInstance.save();
  return result.toObject({ versionKey: false });
};

const getAllProductsFromDb = async (): Promise<(IProduct & Document)[]> => {
  const result = await ProductModel.find({}).select('-__v');
  if (result.length === 0) {
    throw new RequestedItemNotFoundError('No products found');
  }
  return result;
};

const getASingleProductFromDb = async (
  productId: string,
): Promise<(IProduct & Document) | null> => {
  validateProductId(productId);

  const result = await ProductModel.findById(productId);
  if (!result) {
    throw new RequestedItemNotFoundError('Product not found');
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
    throw new RequestedItemNotFoundError('Product not found');
  }
  return result;
};

const deleteASingleProductFromDb = async (
  productId: string,
): Promise<(IProduct & Document) | null> => {
  validateProductId(productId);

  const result = await ProductModel.findByIdAndDelete(productId);
  if (!result) {
    throw new RequestedItemNotFoundError('Product not found');
  }
  return result;
};

const getSearchedProductsFromDb = async (
  searchTerm?: string,
): Promise<IProduct[]> => {
  let query = {};
  if (searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    //Since the requirements did not specify which field of the product to use for the search, I chose to search in both the name and description fields.
    query = { $or: [{ name: regex }, { description: regex }] };
  }
  const result = await ProductModel.find(query);
  if (result.length === 0) {
    throw new RequestedItemNotFoundError('No products found');
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
