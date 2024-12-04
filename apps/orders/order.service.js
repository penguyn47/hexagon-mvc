const Order = require('./order.model');
const OrderItem = require('./order_item.model');
const Product = require('../products/product.model');

const orderService = {
  async createOrder(userId, orderData, orderItems) {
    // Tạo đơn hàng
    const order = await Order.create({
      userId: userId, // Lấy userId từ request
      paymentMethod: orderData.paymentMethod,
      shippingAddress: orderData.shippingAddress,
      orderStatus: orderData.orderStatus,
      totalCost: orderData.totalCost,
    });

    // Thêm các sản phẩm vào đơn hàng
    const items = orderItems.map((item) => ({
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
      include: [
        {
          model: OrderItem,
          include: [
            { model: Product, attributes: ["id", "productName", "price"] },
          ],
        },
      ],
    });
    if (!order) throw new Error("Order not found");

    return order;
  },

  async updateOrderStatus(orderId, status) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error("Order not found");

    order.orderStatus = status;
    await order.save();

    return order;
  },

  async getAllOrders() {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [
            { model: Product, attributes: ["id", "productName", "price"] },
          ],
        },
      ],
    });

    return orders;
  },

  async getOrdersByUser(userId) {
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          attributes: ["id", "quantity", "priceAtPurchase"], // Include quantity here
          include: [
            {
              model: Product,
              attributes: ["id", "productName", "price", "url"], // Ensure the correct attributes
            },
          ],
        },
      ],
    });

    return orders;
  },

  async getOrderProducts(orderId) {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          include: [
            { model: Product, attributes: ["id", "productName", "price"] },
          ],
        },
      ],
    });

    if (!order) throw new Error("Order not found");
    return order.OrderItems.map((item) => ({
      productId: item.productId,
      productName: item.product.productName,
      price: item.product.price,
      quantity: item.quantity,
    }));
  },

  async getDataFormatPayment(orderId) {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          include: [
            { model: Product, attributes: ["id", "productName", "price"] },
          ],
        },
      ],
    });
    if (!order) throw new Error("Order not found");
    const dataForm = {
      orderCode: Math.floor(Math.random() * 1000000),
      //   amount: order.totalCost,
      amount: 2000,
      description: "Thanh toan don hang",
      items: order.order_items.map((item) => ({
        name: item.product.productName,
        quantity: item.quantity,
        price: item.product.price,
      })),
      //   Tự cài lại sau
      cancelUrl: "http://localhost:3000/orders",
      returnUrl: `http://localhost:3000/orders/payment/success/${orderId}`,
    };

    return dataForm;
  },

  async setPaymentStatus(orderId) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error("Order not found");

    order.paymentStatus = 'paid';
    await order.save();

    return order;
  },
};

module.exports = orderService;
