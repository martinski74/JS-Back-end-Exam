const { Schema, model } = require('mongoose');

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  recommendList: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Recipe = model('Recipe', recipeSchema);

module.exports = { Recipe };
