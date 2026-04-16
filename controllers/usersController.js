// Controller functions for Users (Collection 1)

// Example: Get all items in Users (Collection 1)
const User = require('../models/userModel');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateUserPayload = (payload, isUpdate = false) => {
  const allowedFields = ['name', 'email', 'role', 'oauthId'];
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
    if (!payload.name || !payload.email) {
      return 'name and email are required';
    }
  }

  if (payload.name !== undefined) {
    if (typeof payload.name !== 'string' || payload.name.trim().length === 0) {
      return 'name must be a non-empty string';
    }
  }

  if (payload.email !== undefined) {
    if (typeof payload.email !== 'string' || !emailRegex.test(payload.email)) {
      return 'email must be a valid email address';
    }
  }

  if (payload.role !== undefined && !['user', 'admin'].includes(payload.role)) {
    return 'role must be either user or admin';
  }

  if (payload.oauthId !== undefined && typeof payload.oauthId !== 'string') {
    return 'oauthId must be a string';
  }

  return null;
};

// CREATE USER
const createUser = async (req, res) => {
  try {
    const validationError = validateUserPayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { name, email, role, oauthId } = req.body;

    const newUser = new User({ name, email, role, oauthId });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET SINGLE USER
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// UPDATE USER
const updateUser = async (req, res) => {
  try {
    const validationError = validateUserPayload(req.body, true);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
    { returnDocument: 'after', runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};