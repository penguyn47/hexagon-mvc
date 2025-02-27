const Review = require('../reviews/review.model');
const Product = require('../products/product.model');
const User = require('../users/user.model');

const ReviewService = {
  // Tạo review mới
  async createReview(data) {
    try {
      const review = await Review.create(data);
      const createdReview = await Review.findByPk(review.id, {
        include: [
          { model: User, attributes: ['id', 'username', 'url'] },
        ],
      });
      return createdReview;
    } catch (error) {
      throw new Error(`Error creating review: ${error.message}`);
    }
  },
  async getReviewsByProduct(productId, page = 0) {
    const limit = 4;
    const offset = page * limit;
    try {
      const reviews = await Review.findAll({
        where: { productId },
        limit: limit,
        offset: offset,
        include: [
          { model: User, attributes: ["id", "username", "url"] }, // Bao gồm thông tin user
        ],
      });
      return reviews;
    } catch (error) {
      throw new Error(`Error fetching reviews for product: ${error.message}`);
    }
  },
  // Lấy một review theo ID
  async getReviewById(reviewId) {
    try {
      const review = await Review.findByPk(reviewId, {
        include: [
          { model: Product, attributes: ['id', 'name'] }, // Bao gồm thông tin sản phẩm
          { model: User, attributes: ['id', 'username', 'url'] }, // Bao gồm thông tin user
        ],
      });
      if (!review) throw new Error('Review not found');
      return review;
    } catch (error) {
      throw new Error(`Error fetching review by ID: ${error.message}`);
    }
  },

  // Cập nhật review
  async updateReview(reviewId, data) {
    try {
      const review = await Review.findByPk(reviewId);
      if (!review) throw new Error('Review not found');
      await review.update(data);
      return review;
    } catch (error) {
      throw new Error(`Error updating review: ${error.message}`);
    }
  },

  // Xóa review
  async deleteReview(reviewId) {
    try {
      const review = await Review.findByPk(reviewId);
      if (!review) throw new Error('Review not found');
      await review.destroy();
      return { message: 'Review deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting review: ${error.message}`);
    }
  }
}

module.exports = ReviewService;