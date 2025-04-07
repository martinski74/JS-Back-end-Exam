const {Recipe} = require('./models/Recipe.js');
const { recipes } = require('./seed.js');
function parseError(err) {
  if (err instanceof Error) {
    if (!err.errors) {
      // Generic error
      err.errors = [err.message];
    } else {
      // Mongoose validation error
      const error = new Error('Input validation error');
      error.errors = Object.fromEntries(
        Object.values(err.errors).map((e) => [e.path, e.message])
      );

      return error;
    }
  } else if (Array.isArray(err)) {
    // Express-validator error array
    const error = new Error('Input validation error');
    error.errors = Object.fromEntries(err.map((e) => [e.path, e.msg]));

    return error;
  }

  return err;
}

const seedDataBase = async() => {
  for (const recipe of Object.values(recipes)) {
    // console.log(recipe);
    
    const newRecipe = new Recipe(recipe);
    await newRecipe.save();
}
}

module.exports = { parseError, seedDataBase };
