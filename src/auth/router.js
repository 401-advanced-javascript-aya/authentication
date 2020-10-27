'use strict';

const express = require('express');
// const router = express.Router();
const app = express();
const usersModel = require('../auth/models/users-model');
const bearerMiddleware = require('../middleware/bearer');

// router.param('model', modelFinder);

app.post('/signup', signup);
app.post('/signin', signin);
app.get('/users', users);
app.get('/secret', bearerMiddleware, secretFunc)

function signup(req, res) {
  usersModel.save(req.body).then((data) => {
    let token = usersModel.generateToken(data);
    res.status(200).send(token);
    }).catch((err) => {
      console.log('ERR!!>>>>>>>>', err);
      res.status(403).send('Invalid Signup! email is taken');
    });
}
function signin(req, res) {
  usersModel.get().then((data) => {
    let count = data.length;
    let results = data;
    res.status(200).json({ count, results });
  });
  // .catch(next);
}

function users(req, res) {
  console.log('we are in function');

 usersModel.list(undefined).then((result) => {
   console.log('we are here');
  res.status(200).send(result);
})
.catch((err) => {
  console.log('ERR!!', err);
  res.status(403).send('Listing error');
});
}

function secretFunc(req,res) {
    res.json(req.users)
}

module.exports = app;