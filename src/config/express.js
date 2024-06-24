const express = require('express');
const cookieParser = require('cookie-parser');
const { session } = require('../middlewares/session');
require('../models/User');
require('../models/Recipe');

const secret = 'jwt secret';
function configureExpress(app) {
  app.use(cookieParser(secret));
  app.use(session());
  app.use(express.urlencoded({ extended: true }));
  app.use('/static', express.static('static'));
}

module.exports = { configureExpress };
