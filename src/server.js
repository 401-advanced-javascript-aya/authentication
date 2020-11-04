'use strict';
require('dotenv').config(); 
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const router = require('./auth/router.js');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const status_404 = require('./middleware/404.js');
const status_500 = require('./middleware/500.js');

app.use('/', router);

app.use('*', status_404);
app.use(status_500);

module.exports = {
  server: app,
  start: PORT => {
    PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  },
};