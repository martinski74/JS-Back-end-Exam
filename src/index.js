const express = require('express');
const app = express();
const mongoose = require('mongoose');

const { configureExpress } = require('./config/express');
const { configureHbs } = require('./config/hbs');
const { router } = require('./config/routes');
const PORT = 3000;

configureExpress(app);
configureHbs(app);
app.use(router);

mongoose
  .connect('mongodb://localhost:27017/cooking-recipes')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('Cannot connect to DB', err));
