'use strict';
const express = require('express');
const router = express.Router();

const users = require('./models/users-schema');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const oauth = require('./middleware/oauth');

router.post('/signup', signupHandler);
router.post('/signin', basicAuth, signinHandler);
router.get('/users', basicAuth, usersHandler);
router.get('/secret', bearerAuth, handleSecret);

async function signupHandler(req, res) {
  users.findOne({ username: req.body.username }).then(results => {
    console.log('req.body.username in router', req.body.username);

    if (results) {
      res.send('username is already exists! please choose another one');
    } else {
      let user = new users(req.body);

      user.save().then((user) => {
        let token = users.generateToken(user.username);
        res.status(200).send(token);
      });
    }
  });
}

function signinHandler(req, res) {
  console.log('req.basicAuth', req.basicAuth);
  if (req.basicAuth) {
    res.cookie('token', req.basicAuth.token);
    res.set('token', req.basicAuth.token);
    res.status(200).json(req.basicAuth);
  } else {
    res.status(403).send('Invalid login signinHandler');
  }
}

function usersHandler(req, res) {
  if (req.basicAuth.token) {
    users.find().then(result => {
      res.status(200).json({ numberOfUsers: result.length, TheList: result });
    });
  } else {
    res.status(403).send('Invalid login ,,,usersHandler ');
  }
}

function handleSecret(req, res) {
  console.log('req.user', req.user);
  res.status(200).send(req.user);
}

router.get('/oauth', oauth, (req, res) => {
  res.status(200).send(req.token);

});


module.exports = router;