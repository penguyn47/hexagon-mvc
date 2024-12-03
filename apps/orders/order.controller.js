const orderService = require('./order.service');

const orderController = {
    async createOrder(req, res) {
        try {
            // Lấy user_id từ req.user sau khi Passport xác thực người dùng
            const userId = req.user.id;

            // Lấy dữ liệu đơn hàng và sản phẩm từ request body
            const { orderData, orderItems } = req.body;

            // Tạo đơn hàng thông qua service
            const order = await orderService.createOrder(userId, orderData, orderItems);

            // Trả về thông tin đơn hàng vừa tạo
            res.status(201).json(order);
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async getOrderById(req, res) {
        try {
            const orderId = req.params.id;
            const order = await orderService.getOrderById(orderId);
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateOrderStatus(req, res) {
        try {
            const orderId = req.params.id;
            const { status } = req.body;
            const order = await orderService.updateOrderStatus(orderId, status);
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getOrdersByUser(req, res) {
        try {
            const userId = req.params.userId;
            const orders = await orderService.getOrdersByUser(userId);
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getOrderProducts(req, res) {
        try {
            const orderId = req.params.id;
            const products = await orderService.getOrderProducts(orderId);
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = orderController;
