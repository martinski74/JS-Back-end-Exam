const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { configureExpress } = require('./config/express');
const { configureHbs } = require('./config/hbs');
const { router } = require('./config/routes');
const PORT = process.env.PORT || 3000;

configureExpress(app);
configureHbs(app);
app.use(router);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
   
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('Cannot connect to DB', err));
