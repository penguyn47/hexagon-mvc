const express = require('express');
const router = express.Router();

const reviewController = require('./review.controller');

router.get('/:productId', reviewController.getAllReviewsByProductId);

router.post('/:productId', reviewController.addReviewByProductId);

router.patch('/:productId/:reviewId', reviewController.updateReviewByProductId);

router.delete('/:productId/:reviewId', reviewController.deleteReviewByIdProduct);


module.exports = router;