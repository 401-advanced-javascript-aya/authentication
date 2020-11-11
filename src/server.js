'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const router = require('./auth/router.js');
// const port = process.env.PORT || 3000
app.use(express.static('./public'));

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
  start: (port) => {
    app.listen(port, () => {
      const PORT = port || process.env.PORT || 3000;
      console.log(`up and running on port ${PORT}`);
    });
  },
};
