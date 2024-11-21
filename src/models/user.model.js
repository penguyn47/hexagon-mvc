const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter username"],
    unique: [true, "unique username"],
  },

  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: [true, "unique email"],
  },

  password: {
    type: String,
    required: [true, "Please enter user password"],
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
