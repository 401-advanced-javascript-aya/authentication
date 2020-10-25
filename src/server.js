const express = require('express');
const morgan = require('morgan');
const app = express();
const error404 = require('./middleware/404');
const error500 = require('./middleware/500');
const apiRout = require('./auth/router');
const cors = require('cors');


// app.use('/', ctgRouter);


app.use(cors);
app.use(morgan());

app.use(express.json());

app.use('/', apiRout);

app.get('/', (req, res) => {
  res.send('Welcome!');
});

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