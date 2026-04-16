const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewsController');
const isAuthenticated = require("../middleware/authMiddleware");
// Create review
router.post(
  '/',
  isAuthenticated,
  /*
    #swagger.tags = ['Reviews']
    #swagger.summary = 'Create a review'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        userId: '69cf1d9cd2fc2d5ef09951fc',
        productId: '69cf34ae754dd9d26ef0bada',
        rating: 5,
        comment: 'Amazing product!'
      }
    }
  */
  controller.createReview
);

// Get all reviews
router.get(
  '/',
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Get all reviews'
  */
  controller.getReviews
);

// Get review by ID
router.get(
  '/:id',
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Get review by ID'
  */
  controller.getReviewById
);

// Update review
router.put(
  '/:id',
  isAuthenticated,
  /*
    #swagger.tags = ['Reviews']
    #swagger.summary = 'Update review'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        rating: 4,
        comment: 'Updated review text'
      }
    }
  */
  controller.updateReview
);

// Delete review
router.delete(
  '/:id',
  isAuthenticated,
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Delete review'
  */
  controller.deleteReview
);

module.exports = router;