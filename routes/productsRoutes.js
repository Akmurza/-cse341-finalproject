const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController');
const auth = require("../middleware/authMiddleware");

// Create product
router.post(
  '/',
  auth,
  /*
    #swagger.tags = ['Products']
    #swagger.summary = 'Create a product'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'Chocolate Cake',
        description: 'Delicious soft cake',
        price: 25000,
        category: 'cakes',
        imageUrl: 'https://example.com/image.jpg',
        stock: 10
      }
    }
  */
  controller.createProduct
);

// Get all products
router.get(
  '/',
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Get all products'
  */
  controller.getProducts
);

// Get product by ID
router.get(
  '/:id',
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Get product by ID'
  */
  controller.getProductById
);

// Update product
router.put(
  '/:id',
  auth,
  /*
    #swagger.tags = ['Products']
    #swagger.summary = 'Update product'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        price: 30000,
        stock: 5
      }
    }
  */
  controller.updateProduct
);

// Delete product
router.delete(
  '/:id',
  auth,
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Delete product'
  */
  controller.deleteProduct
);

module.exports = router;