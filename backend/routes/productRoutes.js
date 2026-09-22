const express = require('express');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

// all product routes need login
router.use(protect);

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
