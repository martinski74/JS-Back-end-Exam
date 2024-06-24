const { verifyToken } = require('../services/token');

function session() {
  return function (req, res, next) {
    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = verifyToken(token);
        req.user = decoded;
        res.locals.hasUser = true;
      } catch (error) {
        res.clearCookie('token');
      }
    }

    next();
  };
}

module.exports = { session };
