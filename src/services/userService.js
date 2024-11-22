const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key";

// Generate token
function generateToken(user) {
  const payload = {
    username: user.username,
  };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" }); // Token hết hạn sau 1 giờ
}
// End Generate token

// Function to hash and verify password
async function hashPassword(plainPassword) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// End Function to hash and verify password

const createUser = async (userData) => {
  const { username, email, password } = userData;

  try {
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    return user;
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};

const loginUser = async (userData) => {
  const { username, password } = userData;

  try {
    // Tìm người dùng theo tên đăng nhập
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User or password incorrect");
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("User or password incorrect");
    }

    // Tạo và trả về token
    const token = generateToken(user);

    // Cập nhật token trong cơ sở dữ liệu
    user.token = token;
    await user.save();

    return { token, username: user.username };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createUser,
  loginUser,
};
