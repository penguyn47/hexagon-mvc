const { DataTypes } = require('sequelize');
const db = require('../../configs/db');

const Order = db.define('order', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Liên kết tới bảng User
      key: 'id',
    },
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['credit_card', 'paypal', 'cash_on_delivery']], // Các phương thức thanh toán hợp lệ
    },
  },
  shippingAddressId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  orderStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // Trạng thái mặc định là "pending"
    validate: {
      isIn: [['pending', 'processing', 'shipped', 'completed', 'cancelled']], // Các trạng thái hợp lệ
    },
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Mặc định là thời gian hiện tại
  },
  totalCost: {
    type: DataTypes.DECIMAL(10, 2), // Tổng giá trị đơn hàng
    allowNull: false,
    defaultValue: 0.00,
  },
}, {
  timestamps: true, // Tự động thêm createdAt và updatedAt
});

module.exports = Order;
