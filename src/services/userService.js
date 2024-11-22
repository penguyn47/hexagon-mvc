const bcrypt = require("bcrypt");
const User = require("../models/user.model");

// Function to hash and verify password
async function hashPassword(plainPassword) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
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

module.exports = {
  createUser,
};
