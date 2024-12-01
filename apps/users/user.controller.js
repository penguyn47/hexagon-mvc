const userService = require('./user.service');
const passport = require('passport');

const userController = {

    // Tạo người dùng mới
    async createUser(req, res) {
        try {
            // Lấy dữ liệu từ request body
            const { username, email, password, firstName, lastName, url } = req.body;

            // Kiểm tra xem tên người dùng hoặc email đã tồn tại chưa
            if (await userService.checkIfUsernameExists(username)) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            if (await userService.checkIfEmailExists(email)) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Tạo người dùng mới
            const newUser = await userService.createUser({ username, email, password, firstName, lastName, url });

            // Trả về kết quả
            return res.status(201).json({
                message: 'User created successfully',
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    url: newUser.url,
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

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
                url: user.url,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    // Cập nhật thông tin người dùng
    async updateUser(req, res) {
        console.log(req.body);
        try {
            const userId = req.user.id; // Get user ID from authenticated session
            const { username, email, password, firstName, lastName, profileImg } = req.body;

            // Fetch the current user data
            const currentUser = await userService.getUserById(userId);

            
            url = profileImg;
            // Prepare the update data
            const updateData = { username, email, password, firstName, lastName, url };

            // Handle profile image upload if necessary
            // if (req.profileImg) {
            //     updateData.profileImg = req.profileImg.path; // Assuming you are using multer for file uploads
            // } else {
            //     updateData.profileImg = currentUser.profileImg; // Retain the existing profile image URL
            // }
            console.log(updateData);

            // Update the user information
            const updatedUser = await userService.updateUser(userId, updateData);

            // Re-authenticate the user to update the session
            req.logIn(updatedUser, function(err) {
                if (err) {
                    console.error('Error re-authenticating user:', err);
                    return res.status(500).json({ message: 'Server error' });
                }

                // Return the updated user information
                return res.status(200).json({
                    message: 'User updated successfully',
                    user: {
                        id: updatedUser.id,
                        username: updatedUser.username,
                        email: updatedUser.email,
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        profileImg: updatedUser.profileImg,
                    }
                });
            });

        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    // Xóa người dùng
    async deleteUser(req, res) {
        try {
            const userId = req.params.id;

            const result = await userService.deleteUser(userId);
            return res.status(200).json(result);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    // Render trang account - signup
    async renderSignupPage(req, res) {
        res.render('register', {
            currentView: 'login'
        })
    },

    // Render trang account - login
    async renderLoginPage(req, res) {
        res.render('login', {
            currentView: 'login'
        })
    },

    // Đăng nhập người dùng
    async loginUser(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/',
        })(req, res, next);
    },

    async logoutUser(req, res) {
        req.logout(()=>{
            res.redirect('/users/login');
        });
        
    },
};

module.exports = userController;
