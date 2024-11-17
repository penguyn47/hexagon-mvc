const argon2 = require('argon2');
const User = require('../models/user.model');

const createUser = async (userData) => {
    const { username, email, password } = userData;

    try {
        const hashedPassword = await argon2.hash(password);

        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
        });

        return user;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};

module.exports = {
    createUser,
};
