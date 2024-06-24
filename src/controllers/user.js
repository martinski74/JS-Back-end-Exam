const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const { createToken } = require('../services/token');
const { register, login } = require('../services/user');
const { isGuest, isUser } = require('../middlewares/guards');
const { parseError } = require('../util');
const userRouter = Router();

userRouter.get('/register', isGuest(), (req, res) => {
  res.render('register');
});

userRouter.post(
  '/register',
  body('username')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Username must be between 2 and 20 characters long'),
  body('email').isEmail().isLength({ min: 10 }).withMessage('Invalid email'),
  body('password')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters long'),
  body('repass')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords don't match"),
  isGuest(),
  async (req, res) => {
    const { username, email, password, repass } = req.body;

    try {
      const result = validationResult(req);

      if (result.errors.length) {
        throw result.errors;
      }

      const user = await register(username, email, password);
      const token = createToken(user);
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/');
    } catch (error) {
      res.render('register', {
        data: { username, email },
        errors: parseError(error).errors,
      });
      return;
    }
  }
);

userRouter.get('/login', isGuest(), (req, res) => {
  res.render('login');
});
userRouter.post('/login', isGuest(), async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await login(email, password);
    const token = createToken(user);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } catch (err) {
    res.render('login', { data: { email }, errors: err.errors });
    return;
  }
});

userRouter.get('/logout', isUser(), (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = { userRouter };
