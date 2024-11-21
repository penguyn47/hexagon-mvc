const bcrypt = require('bcrypt');
const User = require('../models/user.model');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');

// Function to hash password
async function hashPassword(plainPassword) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}

async function verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

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
        throw new Error('Error creating user: ' + error.message);
    }
};

const loginUser = async (userData) => {
    const { username, password } = userData;
    
    const user = await User.findOne({
        username: username,
    });
    
    if (user) {
        const isMatch = await verifyPassword(password, user.password);
        if (isMatch) {
            return true;
        }
        else {
            return false;
        }
    }
};

module.exports = {
    createUser,
    loginUser,
};