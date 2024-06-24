const { Router } = require('express');
const homeRouter = Router();

const { getRecent } = require('../services/recipe');

homeRouter.get('/', async (req, res) => {
  const recipes = await getRecent();
  for (const recipe of recipes) {
    recipe.isAuthor = req.user && req.user._id == recipe.owner.toString();
  }
  res.render('home', { recipes });
});

module.exports = { homeRouter };
