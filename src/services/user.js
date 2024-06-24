const bcrypt = require('bcrypt');
const { User } = require('../models/User');

const register = async (username, email, password) => {
  const existing = await User.findOne({ email });

  if (existing) {
    const err = new Error('Email in use');
    err.errors = { email: 'Email in use' };
    throw err;
  }

  const user = new User({
    username,
    email,
    password: await bcrypt.hash(password, 10),
  });
  await user.save();

  return user;
};

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Incorrect email or password');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    const err = new Error('Incorrect email or password');
    err.errors = { password: 'Incorrect email or password' };
    throw err;
  }

  return user;
};

module.exports = { register, login };
