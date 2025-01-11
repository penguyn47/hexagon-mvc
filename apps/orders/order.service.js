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
    order.orderCode = Math.floor(Math.random() * 1000000);
    await order.save();
    const dataForm = {
      orderCode: order.orderCode,
      //   amount: order.totalCost,
      amount: 10000,
      description: "Thanh toan don hang",
      items: order.order_items.map((item) => ({
      name: item.product.productName,
      quantity: item.quantity,
      price: item.product.price,
      })),
      //   Tự cài lại sau
      cancelUrl: `${process.env.HOST_WEB}/orders`,
      returnUrl: `${process.env.HOST_WEB}/orders`,
    };

    return dataForm;
  },

  async setPaymentStatusSuccess(orderCode) {
    const order = await Order.findOne({ where: { orderCode } });
    if (!order) throw new Error("Order not found");

    order.paymentStatus = "paid";
    await order.save();

    return order;
  },
};

module.exports = orderService;
