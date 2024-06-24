const jwt = require('jsonwebtoken');
const secret = 'jwt secret';

function createToken(user) {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  const token = jwt.sign(payload, secret, { expiresIn: '1h' });

  return token;
}

function verifyToken(token) {
  return jwt.verify(token, secret);
}

module.exports = { createToken, verifyToken };
