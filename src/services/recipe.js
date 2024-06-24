const { Recipe } = require('../models/Recipe');

const createRecipe = async (recipe) => {
  const newRecipe = new Recipe(recipe);
  await newRecipe.save();

  return newRecipe;
};

const getAllRecipes = async () => {
  const recipes = await Recipe.find().lean();
  return recipes;
};

const getRecent = async () => {
  const recipes = await Recipe.find().sort({ _id: -1 }).limit(3).lean();
  return recipes;
};

const getRecipeById = async (id) => {
  const recipe = await Recipe.findById(id).lean();
  return recipe;
};

const updateRecipe = async (recipeId, recipeData, authorId) => {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new Error('Recipe not found');
  }

  if (recipe.owner.toString() != authorId) {
    throw new Error('Access denied');
  }

  recipe.title = recipeData.title;
  recipe.ingredients = recipeData.ingredients;
  recipe.instructions = recipeData.instructions;
  recipe.description = recipeData.description;
  recipe.image = recipeData.image;

  recipe.save();

  return recipe;
};

const deleteRecipe = async (recipeId, authorId) => {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new Error('Recipe not found');
  }
  if (recipe.owner.toString() != authorId) {
    throw new Error('Access denied');
  }

  await Recipe.findByIdAndDelete(recipeId);
};

const findRecipies = async (query) => {
  try {
    let recipies = {};
    if (query) {
      const regex = new RegExp(query, 'i');
      recipies = await Recipe.find({ title: regex }).lean();
    } else {
      recipies = await Recipe.find().lean();
    }
    return recipies;
  } catch (error) {
    console.log(error);
  }
};

const recommendRecipe = async (recipeId, userId) => {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new Error('Recipe not found');
  }
  if (recipe.recommendList.find((r) => r.toString() == userId)) {
    return;
  }
  recipe.recommendList.push(userId);
  recipe.save();
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecent,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  findRecipies,
  recommendRecipe,
};
