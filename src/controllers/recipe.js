const { Router } = require('express');
const { isUser } = require('../middlewares/guards');
const { parseError } = require('../util');
const {
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  recommendRecipe,
} = require('../services/recipe');
const { body, validationResult } = require('express-validator');

const recipeRouter = Router();

recipeRouter.get('/create', isUser(), (req, res) => {
  res.render('create');
});

recipeRouter.post(
  '/create',
  body('title')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Title must be at least 2 characters long'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage('Description must be between 10 and 100 characters long'),
  body('ingredients')
    .trim()
    .isLength({ min: 20, max: 200 })
    .withMessage('Ingredients must be between 20 and 200 characters long'),
  body('instructions')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Instructions must be at least 10 characters long'),
  body('image')
    .trim()
    .isURL({ require_tld: false })
    .withMessage('Image must be a valid URL string'),
  isUser(),
  async (req, res) => {
    const newRecipe = {
      ...req.body,
      owner: req.user._id,
    };
    try {
      const result = validationResult(req);

      if (result.errors.length) {
        throw result.errors;
      }

      await createRecipe(newRecipe);
      res.redirect('/catalog');
    } catch (err) {
      res.render('create', {
        recipe: newRecipe,
        errors: parseError(err).errors,
      });
    }
  }
);

recipeRouter.get('/edit/:id', isUser(), async (req, res) => {
  const recipe = await getRecipeById(req.params.id);
  if (!recipe) {
    return res.render('404');
  }
  if (req.user._id != recipe.owner.toString()) {
    return res.render('404');
  }

  res.render('edit', { recipe });
});

recipeRouter.post('/edit/:id', isUser(), async (req, res) => {
  const recipeId = req.params.id;
  const authorId = req.user._id;

  try {
    await updateRecipe(recipeId, req.body, authorId);
  } catch (err) {
    if (err.message == 'Access denied') {
      res.redirect('/login');
    } else {
      res.redirect('404');
    }
    return;
  }
  res.redirect('/catalog');
});

recipeRouter.get('/delete/:id', isUser(), async (req, res) => {
  const recipeId = req.params.id;
  const authorId = req.user._id;

  try {
    await deleteRecipe(recipeId, authorId);
  } catch (error) {
    if (error.message == 'Access denied') {
      res.redirect('/login');
    } else {
      console.log(error);
      res.redirect('404');
    }
    return;
  }
  res.redirect('/catalog');
});

recipeRouter.get('/recommend/:id', async (req, res) => {
  const recipeId = req.params.id;
  const authorId = req.user._id;

  try {
    await recommendRecipe(recipeId, authorId);
    res.redirect('/details/' + recipeId);
  } catch (error) {
    res.redirect('/');
  }
});

module.exports = { recipeRouter };
