'use strict';
const express = require('express');
const router = express.Router();
const users = require('./models/users-model');
const basicAuth = require('./middleware/basic.js');
const modelFinder = require('../middleware/model-finder.js');

router.param('model', modelFinder.gettingModel);

router.post('/signup', signupHandler);
router.post('/signin', basicAuth, signinHandler);
router.get('/:model', usersHandler);



async function signupHandler(req, res) {
  let model = req.body;
  console.log(model);
  try {
    let modelll = await users.create(model);
    res.status(200).json(modelll);
    const token = users.generateToken(model);
    console.log('token',token);
    return token;

  } catch(error){
    console.log('err', error);
  }
}



function signinHandler(req, res, next) {
  console.log('signinHandler');
  res.json({ token: req.token,
    user: req.user, 
  });
}


async function usersHandler(req, res, next) {
  console.log('model <<< users');
  let modelll = await req.model.list();
  res.json({count:modelll.length, results: modelll});
}



module.exports = router;