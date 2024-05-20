import express from 'express';
import { productController } from './products.controller';
const router = express.Router();

router.post('/', productController.addProductToDb);
router.get('/', productController.getAllProductsFromDb);
router.get('/:productId', productController.getASingleProductFromDb);
router.put('/:productId', productController.updateAProduct);
router.delete('/:productId', productController.deleteASingleProductFromDb);

export const ProductsRoutes = router;
