const Order = require('../models/orderModel');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const isValidObjectId = (value) => typeof value === 'string' && objectIdRegex.test(value);

const validateOrderPayload = (payload, isUpdate = false) => {
  const allowedFields = ['userId', 'products', 'totalPrice', 'status'];
  const incomingFields = Object.keys(payload);

  if (isUpdate) {
    if (incomingFields.length === 0) {
      return 'At least one field is required for update';
    }

    const hasInvalidField = incomingFields.some((field) => !allowedFields.includes(field));
    if (hasInvalidField) {
      return 'Payload contains unsupported field(s)';
    }
  } else {
    if (!payload.userId || !payload.products || payload.totalPrice === undefined) {
      return 'userId, products, and totalPrice are required';
    }
  }

  if (payload.userId !== undefined && !isValidObjectId(payload.userId)) {
    return 'userId must be a valid ObjectId';
  }

  if (payload.products !== undefined) {
    if (!Array.isArray(payload.products) || payload.products.length === 0) {
      return 'products must be a non-empty array';
    }

    const invalidProductId = payload.products.some((id) => !isValidObjectId(id));
    if (invalidProductId) {
      return 'All products entries must be valid ObjectId values';
    }
  }

  if (payload.totalPrice !== undefined) {
    if (typeof payload.totalPrice !== 'number' || Number.isNaN(payload.totalPrice) || payload.totalPrice < 0) {
      return 'totalPrice must be a number greater than or equal to 0';
    }
  }

  if (payload.status !== undefined && !['pending', 'completed'].includes(payload.status)) {
    return 'status must be either pending or completed';
  }

  return null;
};

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const validationError = validateOrderPayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { userId, products, totalPrice, status } = req.body;

    const newOrder = new Order({ userId, products, totalPrice, status });
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET ALL ORDERS
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products'); // no userId populate
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE ORDER
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE ORDER
const updateOrder = async (req, res) => {
  try {
    const validationError = validateOrderPayload(req.body, true);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};