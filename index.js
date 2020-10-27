'use strict';

require('dotenv').config();
const server = require('./src/server');
const mongoose = require('mongoose');


const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb+srv://aya93:good401@signinup.pdwy6.mongodb.net/sign?retryWrites=true&w=majority';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.start(process.env.PORT || 3000);
  })
  .catch((err) => console.error(err.message));