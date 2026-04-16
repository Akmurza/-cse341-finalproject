const Review = require('../models/reviewModel');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const isValidObjectId = (value) => typeof value === 'string' && objectIdRegex.test(value);

const validateReviewPayload = (payload, isUpdate = false) => {
  const allowedFields = ['userId', 'productId', 'rating', 'comment'];
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
    if (!payload.userId || !payload.productId || payload.rating === undefined || payload.comment === undefined) {
      return 'userId, productId, rating, and comment are required';
    }
  }

  if (payload.userId !== undefined && !isValidObjectId(payload.userId)) {
    return 'userId must be a valid ObjectId';
  }

  if (payload.productId !== undefined && !isValidObjectId(payload.productId)) {
    return 'productId must be a valid ObjectId';
  }

  if (payload.rating !== undefined) {
    if (typeof payload.rating !== 'number' || Number.isNaN(payload.rating) || payload.rating < 1 || payload.rating > 5) {
      return 'rating must be a number between 1 and 5';
    }
  }

  if (payload.comment !== undefined) {
    if (typeof payload.comment !== 'string' || payload.comment.trim().length === 0) {
      return 'comment must be a non-empty string';
    }
  }

  return null;
};

// CREATE REVIEW
const createReview = async (req, res) => {
  try {
    const validationError = validateReviewPayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { userId, productId, rating, comment } = req.body;

    const newReview = new Review({ userId, productId, rating, comment });
    const savedReview = await newReview.save();

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET ALL REVIEWS
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('productId'); // optional: populate product only

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE REVIEW
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('productId');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE REVIEW
const updateReview = async (req, res) => {
  try {
    const validationError = validateReviewPayload(req.body, true);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE REVIEW
const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview
};