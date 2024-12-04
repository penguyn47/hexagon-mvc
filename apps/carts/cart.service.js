const Cart = require('./cart.model');
const CartItem = require('./cart_item.model');
const Product = require('../products/product.model');

const cartService = {
    async createCartIfNotExists(userId) {
        const cart = await Cart.findOne({ where: { userId } });
        return cart || await Cart.create({ userId });
    },

    async addToCart(userId, productId, quantity = 1) {
        const cart = await this.createCartIfNotExists(userId);
        const [cartItem, created] = await CartItem.findOrCreate({
            where: { cartId: cart.id, productId },
            defaults: { quantity },
        });

        if (!created) {
            cartItem.quantity += quantity;
            await cartItem.save();
        }

        return cartItem;
    },

    async getCartItems(userId) {
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) return [];

        const items = await CartItem.findAll({
            where: { cartId: cart.id },
            include: [{ model: Product, attributes: ['id', 'productName', 'price'] }],
        });

        return items;
    },

    async updateCartItemQuantity(userId, productId, quantity) {
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) throw new Error('Cart not found');

        const cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
        if (!cartItem) throw new Error('Cart item not found');

        if (quantity < 1) {
            quantity = 1;
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        return cartItem;
    },

    async removeFromCart(userId, productId) {
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) throw new Error('Cart not found');

        await CartItem.destroy({ where: { cartId: cart.id, productId } });
        return { message: 'Item removed successfully' };
    },

    async clearCart(userId) {
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) throw new Error('Cart not found');

        await CartItem.destroy({ where: { cartId: cart.id } });
        return { message: 'Cart cleared successfully' };
    },
};

module.exports = cartService;
