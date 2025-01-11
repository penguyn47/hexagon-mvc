const orderService = require('./order.service');
const paymentHelper = require("../../helpers/paymentService.helper")

const orderController = {
  async createOrder(req, res) {
    try {
      // Lấy user_id từ req.user sau khi Passport xác thực người dùng
      const userId = req.user.id;

      // Lấy dữ liệu đơn hàng và sản phẩm từ request body
      const { orderData, orderItems } = req.body;

      // Tạo đơn hàng thông qua service
      const order = await orderService.createOrder(
        userId,
        orderData,
        orderItems
      );

      // Trả về thông tin đơn hàng vừa tạo
      res.status(201).json(order);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
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

  async renderOrdersPage(req, res) {
    const ordersRaw = await orderService.getOrdersByUser(req.user.id);

    // Chuyển đổi dữ liệu để chỉ giữ những gì cần thiết
    const orders = ordersRaw.map((order) => ({
      ...order.dataValues,
      order_items: order.order_items.map((item) => ({
        id: item.id,
        productName: item.product.productName, // Access productName from the nested product object
        price: item.product.price, // Access price from the nested product object
        url: item.product.url, // Access url from the nested product object
        quantity: item.quantity, // Include quantity
      })),
    }));

    // // Log the order items to verify the structure
    // orders.forEach(order => {
    //     console.log(order.order_items);
    // });

    res.render("orders", {
      currentView: "",
      cart: true,
      name: req.user?.username,
      profileImg: req.user?.picture,
      orders,
    });
  },

  async paymentMethod(req, res) {
    try {
      const orderId = req.params.id;
      const dataForm = await orderService.getDataFormatPayment(orderId);
      //   res.send(dataForm);
      // Gọi hàm tạo liên kết thanh toán
      const paymentLink = await paymentHelper.createPaymentLink(dataForm);

      // Redirect đến URL thanh toán
      res.redirect(303, await paymentLink.checkoutUrl);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async paymentSuccess(req, res) {
    try {
      const data = paymentHelper.verifyPaymentWebhook(req);
      const orderCode = data.orderCode;
      await orderService.setPaymentStatusSuccess(orderCode);
      res.redirect(303, `${process.env.HOST_WEB}/orders`);
    } catch (error) {
      res.status(500).json({ message: error.message});
    }
  },
};

module.exports = orderController;
