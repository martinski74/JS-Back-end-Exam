const { Router } = require('express');
const router = Router();
const { userRouter } = require('../controllers/user');
const { homeRouter } = require('../controllers/home');
const { catalogRouter } = require('../controllers/catalog');
const { recipeRouter } = require('../controllers/recipe');
const { notFound } = require('../controllers/404');

router.use(homeRouter);
router.use(userRouter);
router.use(catalogRouter);
router.use(recipeRouter);

router.get('*', notFound);

module.exports = { router };
