// Controller functions for Products

const Product = require('../models/productModel');

const validateProductPayload = (payload, isUpdate = false) => {
  const requiredFields = ['name', 'description', 'price', 'category', 'imageUrl'];

  if (!isUpdate) {
    for (const field of requiredFields) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        return `${field} is required`;
      }
    }
  } else {
    const allowedFields = ['name', 'description', 'price', 'category', 'imageUrl', 'stock', 'rating', 'isAvailable'];
    const incomingFields = Object.keys(payload);

    if (incomingFields.length === 0) {
      return 'At least one field is required for update';
    }

    const hasInvalidField = incomingFields.some((field) => !allowedFields.includes(field));
    if (hasInvalidField) {
      return 'Payload contains unsupported field(s)';
    }
  }

  if (payload.name !== undefined && typeof payload.name !== 'string') return 'name must be a string';
  if (payload.description !== undefined && typeof payload.description !== 'string') return 'description must be a string';
  if (payload.category !== undefined && typeof payload.category !== 'string') return 'category must be a string';
  if (payload.imageUrl !== undefined && typeof payload.imageUrl !== 'string') return 'imageUrl must be a string';

  if (payload.price !== undefined) {
    if (typeof payload.price !== 'number' || Number.isNaN(payload.price) || payload.price < 0) {
      return 'price must be a number greater than or equal to 0';
    }
  }

  if (payload.stock !== undefined) {
    if (typeof payload.stock !== 'number' || Number.isNaN(payload.stock) || payload.stock < 0) {
      return 'stock must be a number greater than or equal to 0';
    }
  }

  if (payload.rating !== undefined) {
    if (typeof payload.rating !== 'number' || Number.isNaN(payload.rating) || payload.rating < 0 || payload.rating > 5) {
      return 'rating must be a number between 0 and 5';
    }
  }

  if (payload.isAvailable !== undefined && typeof payload.isAvailable !== 'boolean') {
    return 'isAvailable must be a boolean';
  }

  return null;
};

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const validationError = validateProductPayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const product = new Product(req.body);
    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const validationError = validateProductPayload(req.body, true);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};