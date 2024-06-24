const { Router } = require('express');
const {
  getAllRecipes,
  getRecipeById,
  findRecipies,
} = require('../services/recipe');

const catalogRouter = Router();

catalogRouter.get('/catalog', async (req, res) => {
  const recipes = await getAllRecipes();

  for (const recipe of recipes) {
    recipe.isAuthor = req.user && req.user._id == recipe.owner.toString();
  }

  res.render('catalog', { recipes });
});

catalogRouter.get('/details/:id', async (req, res) => {
  const recipe = await getRecipeById(req.params.id);

  if (!recipe) {
    return res.render('404');
  }
  const isAuthor = req.user && req.user._id == recipe.owner.toString();
  const isRecommended = Boolean(
    recipe.recommendList.find((r) => req.user?._id == r.toString())
  );

  res.render('details', { recipe, isAuthor, isRecommended });
});

catalogRouter.get('/search', async (req, res) => {
  const query = req.query;
  console.log(query.search);
  const recipies = await findRecipies(query.search);

  res.render('search', { recipies, query });
});

module.exports = { catalogRouter };
