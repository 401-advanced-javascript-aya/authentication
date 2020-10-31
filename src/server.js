'use srtict';
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const apiRout = require('./auth/router');
const error404 = require('./middleware/404');
const error500 = require('./middleware/500');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/welcome', (req, res) => {
  res.send('Welcome!');
});

app.use(apiRout);

app.use(error500);
app.use('*', error404);

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      const PORT = port || process.env.PORT || 3000;
      console.log(`up and running on port ${PORT}`);
    });
  },
};