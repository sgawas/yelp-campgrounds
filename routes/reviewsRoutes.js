const express = require('express');

const catchAsync = require('../utils/catchAsync');
const { isUserAuthenticated, isReviewAuthor, validateReview } = require('../middleware');
const { createReview, deleteReview } = require('../controllers/reviews');

const router = express.Router({ mergeParams : true });

router.post('/', isUserAuthenticated, validateReview, catchAsync(createReview));

router.delete('/:reviewId', isUserAuthenticated, isReviewAuthor, catchAsync(deleteReview))

module.exports = router;