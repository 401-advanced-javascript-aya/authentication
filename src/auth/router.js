'use strict';

const express = require('express');
// const router = express.Router();
const app = express();
const usersModel = require('../auth/models/users-model');

// router.param('model', modelFinder);

app.post('/:signup', signup);
app.post('/:signin', signin);
app.get('/:users', users);


function signup(req, res, next) {
  req.model
    .create(req.body)
    .then((data) => {
      let count = data.length;
      let results = data;
      res.status(200).json({ count, results });
    })
    .catch(next);
}
function signin(req, res) {
  req.model.get().then((data) => {
    let count = data.length;
    let results = data;
    res.status(200).json({ count, results });
  });
  // .catch(next);
}

function users(req, res, next) {
  req.model
    .update(req.params.id, req.body)
    .then((data) => {
      let count = data.length;
      let results = data;
      res.status(200).json({ count, results });
    })
    .catch(next);
}

function deleting(req, res, next) {
  req.model
    .delete(req.params.id)
    .then((data) => {
      let results = data;
      res.status(200).json({ results });
    })
    .catch(next);
}

module.exports = app;