const Order = require('./order.model');
const OrderItem = require('./order_item.model');
const Product = require('../products/product.model');

const orderService = {
    async createOrder(userId, orderData, orderItems) {
        // Tạo đơn hàng
        const order = await Order.create({
            userId: userId,  // Lấy userId từ request
            paymentMethod: orderData.paymentMethod,
            shippingAddress: orderData.shippingAddress,
            orderStatus: orderData.orderStatus,
            totalCost: orderData.totalCost,
        });

        // Thêm các sản phẩm vào đơn hàng
        const items = orderItems.map(item => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
        }));
        await OrderItem.bulkCreate(items);

        return order;
    },

    async getOrderById(orderId) {
        const order = await Order.findByPk(orderId, {
            include: [{
                model: OrderItem,
                include: [{ model: Product, attributes: ['id', 'productName', 'price'] }],
            }],
        });
        if (!order) throw new Error('Order not found');
        
        return order;
    },

    async updateOrderStatus(orderId, status) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        order.orderStatus = status;
        await order.save();

        return order;
    },

    async getAllOrders() {
        const orders = await Order.findAll({
            include: [{
                model: OrderItem,
                include: [{ model: Product, attributes: ['id', 'productName', 'price'] }],
            }],
        });

        return orders;
    },

    async getOrdersByUser(userId) {
        const orders = await Order.findAll({
            where: { userId },
            include: [{
                model: OrderItem,
                include: [{ model: Product, attributes: ['id', 'productName', 'price'] }],
            }],
        });

        return orders;
    },

    async getOrderProducts(orderId) {
        const order = await Order.findByPk(orderId, {
            include: [{
                model: OrderItem,
                include: [{ model: Product, attributes: ['id', 'productName', 'price'] }],
            }],
        });

        if (!order) throw new Error('Order not found');
        return order.OrderItems.map(item => ({
            productId: item.productId,
            productName: item.product.productName,
            price: item.product.price,
            quantity: item.quantity,
        }));
    },
};

module.exports = orderService;
