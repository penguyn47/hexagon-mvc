const userService = require("./user.service");
const passport = require("passport");


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
      return res.status(500).json({ message: "Server error" });
    }
  },
  
  // Cập nhật mật khẩu
    async changePassword(req, res) {
        try {
            const userId = req.user.id; // Get user ID from authenticated session
            const { oldPassword, newPassword } = req.body;

            // Fetch the current user data
            const currentUser = await userService.getUserById(userId);

            // Check if the old password matches the current password
            
            if (!await userService.validatePassword(oldPassword, currentUser.password)) {
                return res.status(400).json({ message: 'Incorrect password' });
            }
            // Check if the new password is different from the old password
            if (oldPassword === newPassword) {
                return res.status(400).json({ message: 'New password must be different from the old password' });
            }
            
            password = newPassword;
            const updateData = { password };

           

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
                    successMessage: 'User updated successfully',
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
            return res.status(500).json({ errorMessage: 'Server error' });
        }
    },

  // Cập nhật thông tin người dùng
    async updateUser(req, res) {
        try {
            const userId = req.user.id; // Get user ID from authenticated session
            const { username, email, firstName, lastName, profileImgUrl } = req.body;

            // Fetch the current user data
            const currentUser = await userService.getUserById(userId);
            let imageUrl = currentUser.url;

            if (profileImgUrl) {
                imageUrl = profileImgUrl; // Set the imageUrl from the request body
            }

            // Prepare the update data
            const updateData = {
                username,
                email,
                firstName,
                lastName,
                url: imageUrl
            };


            // Update the user
            const updatedUser = await userService.updateUser(userId, updateData);

            // Update the user session
            req.login(updatedUser, (err) => {
                if (err) {
                    console.error('Error updating session:', err);
                    return res.status(500).json({ errorMessage: 'Server error' });
                }

                // Return the updated user information
                return res.status(200).json({
                    successMessage: 'User updated successfully',
                    user: {
                        id: updatedUser.id,
                        username: updatedUser.username,
                        email: updatedUser.email,
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        profileImg: updatedUser.url,
                    }
                });
            });
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ errorMessage: 'Server error' });
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
      return res.status(500).json({ message: "Server error" });
    }
  },

  // Render trang account - signup
  async renderSignupPage(req, res) {
    res.render("register", {
      currentView: "login",
    });
  },

  // Render trang account - login
  async renderLoginPage(req, res) {
    res.render("login", {
      currentView: "login",
    });
  },

  // Trang ForgotPassword
  async renderForgotPasswordPage(req, res) {
    res.render("forgot-password", {
      currentView: "forgot",
    });
  },

  // Trang điền thông tin để cập nhật
  async renderResetPasswordPage(req, res) {
    res.render("reset-password", {
      currentView: "reset",
    });
  },

  // Đăng nhập người dùng
  async loginUser(req, res, next) {
    // passport.authenticate("local", {
    //   successRedirect: "/",
    // })(req, res, next);

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        // Đăng nhập thành công
        return res.status(200).json({message: info.message });
      });
    })(req, res, next);
  },

  // Đăng nhập người dùng bằng Google (Phải đăng ký gmail trước)
  async loginWithGoogle(req, res) {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
  },

  // Call back cho Google
  async callbackGoogle(req, res, next) {
    passport.authenticate(
      "google",
      { failureRedirect: "/users/login" },
      (err, user, info) => {
        if (!user) {
          // Người dùng không tồn tại hoặc email chưa được xác minh
          // Chưa có thông báo
          return res.redirect("/users/login");
        }
        if (!user.isVerify) {
          // Email chưa được xác minh
          // Chưa có thông báo
          return res.redirect("/users/login");
        }

        // Xác thực thành công, đăng nhập người dùng
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.redirect("/");
        });
      }
    )(req, res, next);
  },

  async logoutUser(req, res) {
    req.logout(() => {
      res.redirect("/users/login");
    });
  },

  // Xác minh tài khoản người dùng
  async verifyAccount(req, res) {
    try {
      const { token } = req.query;
      //   Tìm người dùng
      const user = await userService.verifyAccount(token);
      if (user.error) {
        return res.status(400).send(user.error);
      }
      res.redirect("/users/login");
    } catch (err) {
      res.status(500).send("Error verifying account");
    }
  },

  // Quên mật khẩu
  async forgotPassword(req, res) {
    try {
      const { gmail } = req.body;
      await userService.forgotPassword(gmail);
      res.redirect("/users/reset-password")
    } catch (err) {
      res.status(500).send("Error sending password reset link");
    }
  },

  // Đặt lại mật khẩu
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;      
      const user = await userService.resetPassword(token, password);
      res.status(200).json({ message: user.message }); // Trả về JSON khi thành công
    } catch (err) {
      res.status(400).json({ message: "Invalid token or error resetting password" }); // Đảm bảo JSON khi có lỗi
    }
  },
  // Render trang cá nhân
  async renderProfile(req, res) {
    res.send("PROFILE PAGE");
  },

};

module.exports = userController;
