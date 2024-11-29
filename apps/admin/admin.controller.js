const userService = require('./admin.service');
const passport = require('passport');

const adminController = {

    // Lấy người dùng theo ID
    async getUserById(req, res) {
        try {
            const userId = req.params.id;

            const user = await userService.getUserById(userId);
            return res.status(200).json({
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                url: user.url,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    // Render trang admin login
    async renderAdminLoginPage(req, res) {
        res.render('adminLogin', {
            currentView: 'adminLogin'
        });
    },

    // Đăng nhập admin
    async loginAdmin(req, res, next) {
        console.log('Login admin');
        const { username, password } = req.body;


        const user = await userService.getUserByUsername(username);
        // Log user login attempt
        console.log(`User ${username} attempted to log in at ${new Date().toISOString()}`);
        // Kiểm tra nếu người dùng không phải là admin
        if (!user.isAdmin) {
            return res.status(403).render('adminLogin', {
                currentView: 'adminLogin',
                errorMessage: 'You do not have admin privileges.',
            });
        }
        passport.authenticate('local', {
            successRedirect: '/admin/addProduct',
        })(req, res, next);
    },

    // Đăng xuất admin
    async logoutAdmin(req, res) {
        req.logout(() => {
            res.redirect('/admin/login');
        });
    },
};

module.exports = adminController;
