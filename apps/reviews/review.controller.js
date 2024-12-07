const reviewService = require('./review.service');

const reviewController = {
    // Lấy thông tin sản phẩm theo productId
    async getAllReviewsByProductId(req, res) {
        try {
            const productId = req.params.productId; // Lấy id từ URL
            const reviews = await reviewService.getReviewsByProduct(productId);
            res.status(200).json(reviews); // Trả về tất cả reviews tìm được
        } catch (error) {
            res.status(404).json({ message: error.message }); // Nếu không tìm thấy, trả về 404
        }
    },

    // Thêm thông tin sản phẩm theo productId
    async addReviewByProductId(req, res) {
        try {
            const data = {
                content: req.body.content,
                productId: req.params.productId,
                userId: req.user?.id,
                comment: req.body.comment,
                rating: req.body.rating
            }
            const review = await reviewService.createReview(data);
            res.status(200).json(review);
        } catch (error) {
            res.status(404).json({ message: error.message }); // Nếu không tìm thấy, trả về 404
        }
    },

    async updateReviewByProductId(req, res) {
        try {
            const reviewId = req.params.reviewId;
            const data = {
                content: req.body.content,
                productId: req.params.productId,
                userId: req.user?.id,
                comment: req.body.comment,
                rating: req.body.rating
            }
            const review = await reviewService.updateReview(reviewId, data);
            res.status(200).json(review);
        } catch (error) {
            res.status(404).json({ message: error.message }); // Nếu không tìm thấy, trả về 404
        }
    },

    async deleteReviewByIdProduct(req, res) {
        try {
            const reviewId = req.params.reviewId;
            const review = await reviewService.deleteReview(reviewId);
            res.status(200).json(review);
        } catch (error) {
            res.status(404).json({ message: error.message }); // Nếu không tìm thấy, trả về 404
        }
    },

};

module.exports = reviewController;
