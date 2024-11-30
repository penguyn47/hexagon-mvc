const bcrypt = require("bcrypt");
const User = require("./user.model");
const { Op } = require("sequelize");
const emailHelper = require("../../helpers/emailService.helper");

const userService = {
  // Tạo người dùng mới
  async createUser(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10); // Mã hóa mật khẩu
      const verificationToken = await bcrypt.genSalt(10);
      const newUser = await User.create({
        ...userData,
        verificationToken: verificationToken,
        password: hashedPassword, // Lưu mật khẩu đã mã hóa
      });
      emailHelper.sendVerificationEmail(newUser.email, verificationToken);
      return newUser;
    } catch (error) {
      throw new Error("Error creating user: " + error.message);
    }
  },

  // Tạo người dùng từ thông tin lấy từ email
  async createUserEmail(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10); // Mã hóa mật khẩu
      const newUser = await User.create({
        ...userData,
        password: hashedPassword, // Lưu mật khẩu đã mã hóa
      });
      return newUser;
    } catch (error) {
      throw new Error("Error creating user: " + error.message);
    }
  },

  // Lấy người dùng theo id
  async getUserById(userId) {
    try {
      const user = await User.findByPk(userId); // Sử dụng primary key (id) để tìm người dùng
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error("Error fetching user: " + error.message);
    }
  },

  // Lấy người dùng theo email
  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error("Error fetching user by email: " + error.message);
    }
  },

  // Lấy người dùng theo email
  async getUserByUsername(username) {
    try {
      const user = await User.findOne({ where: { username } });
      return user;
    } catch (error) {
      throw new Error("Error fetching user by email: " + error.message);
    }
  },

  // Cập nhật thông tin người dùng
  async updateUser(userId, updateData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Nếu có mật khẩu mới, mã hóa mật khẩu trước khi cập nhật
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      await user.update(updateData);
      return user;
    } catch (error) {
      throw new Error("Error updating user: " + error.message);
    }
  },

  // Xóa người dùng
  async deleteUser(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }

      await user.destroy();
      return { message: "User deleted successfully" };
    } catch (error) {
      throw new Error("Error deleting user: " + error.message);
    }
  },

  // Kiểm tra tên người dùng có tồn tại không
  async checkIfUsernameExists(username) {
    try {
      const user = await User.findOne({ where: { username } });
      return user !== null;
    } catch (error) {
      throw new Error("Error checking username: " + error.message);
    }
  },

  // Kiểm tra email đã tồn tại không
  async checkIfEmailExists(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user !== null;
    } catch (error) {
      throw new Error("Error checking email: " + error.message);
    }
  },

  // Xác thực mật khẩu người dùng
  async validatePassword(inputPassword, storedPassword) {
    try {
      const isMatch = await bcrypt.compare(inputPassword, storedPassword);
      return isMatch;
    } catch (error) {
      throw new Error("Error validating password: " + error.message);
    }
  },

  // Xác minh tài khoản
  async verifyAccount(token) {
    try {
      // Tìm người dùng
      const user = await User.findOne({ where: { verificationToken: token } });

      if (!user) {
        return { error: "Invalid or expired token." };
      }

      if (user.isDeleted) {
        return { error: "User account is deleted." };
      }

      // Cập nhật trạng thái xác minh
      user.isVerify = true;
      user.verificationToken = null; // Xóa token sau khi xác minh
      await user.save();

      return { message: "Email verification successful!" };
    } catch (err) {
      return { error: err.message };
    }
  },
};

module.exports = userService;
