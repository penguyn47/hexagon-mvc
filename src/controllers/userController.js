const userService = require("../services/userService");

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await userService.createUser({
      username,
      email,
      password,
    });

    res.status(201).json(user);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating user", error: error.message });
  }
};


exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await userService.loginUser({
      username,
      password,
  });
  console.log(user);
  res.send("OK");
};