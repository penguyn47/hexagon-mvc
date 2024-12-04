const cartService = require('./cart.service');

const cartController = {
    async createCartIfNotExists(req, res) {
        try {
            const userId = req.user.id; // Giả định `req.user.id` chứa ID người dùng đã đăng nhập
            const cart = await cartService.createCartIfNotExists(userId);
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async addToCart(req, res) {
        try {
            const userId = req.user.id;
            const { productId, quantity } = req.body;
            const cartItem = await cartService.addToCart(userId, productId, quantity);
            res.status(200).json(cartItem);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getCartItems(req, res) {
        try {
            const userId = req.user.id;
            const cartItems = await cartService.getCartItems(userId);
            res.status(200).json(cartItems);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateCartItemQuantity(req, res) {
        try {
            const userId = req.user.id;
            const { productId, quantity } = req.body;
            const cartItem = await cartService.updateCartItemQuantity(userId, productId, quantity);
            res.status(200).json(cartItem);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async removeFromCart(req, res) {
        try {
            const userId = req.user.id;
            const { productId } = req.params;
            const result = await cartService.removeFromCart(userId, productId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async clearCart(req, res) {
        try {
            const userId = req.user.id;
            const result = await cartService.clearCart(userId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async renderCartPage(req, res) {
        res.render('cart', {
            currentView: '',
            cart: true,
            name: req.user?.username,
            profileImg: req.user?.picture,
        })
    }
};

module.exports = cartController;
