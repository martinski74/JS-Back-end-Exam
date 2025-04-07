const express = require('express');
const app = express();
const { recipes } = require('./seed.js');
const {seedDataBase} = require('./util.js');
const mongoose = require('mongoose');

const { configureExpress } = require('./config/express');
const { configureHbs } = require('./config/hbs');
const { router } = require('./config/routes');
const PORT = 3000;

configureExpress(app);
configureHbs(app);
app.use(router);

mongoose
  .connect('mongodb://127.0.0.1:27017/cooking-recipes')
  .then(() => {
    seedDataBase()
      .then(() => {
        console.log('Database seeded successfully');
      })
      .catch((err) => {
        console.error('Error seeding database:', err);
      });
  })

  .then(() => {
    console.log('Connected to MongoDB');
   
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('Cannot connect to DB', err));
