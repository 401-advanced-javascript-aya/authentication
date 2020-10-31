'use strict';

const express = require('express');
const router = express.Router();

const users = require('./models/users-schema');
const basicMiddleware = require('./middleware/basic');
const bearerMiddleware = require('../middleware/bearer');

// const app = express();
// const usersModel = require('../auth/models/users-model');

// router.param('model', modelFinder);

router.post('/signup', signupFunc);
router.post('/signin', basicMiddleware, signinFunc);
router.get('/users', basicMiddleware, usersFunc);
router.get('/secret', bearerMiddleware, secretFunc)

function signupFunc(req, res) {
  users.findOne({ username: req.body.username }).then(results => {
    console.log('console: req.body.username in router', req.body.username);

    if (results) {
        res.send('username is already exists! please choose another one');
    } else {
        let user = new users(req.body);
        console.log('console: user: ',user);
        user.save().then((user) => { 
            let token = users.generateToken(user.username); 
            res.status(200).send(token);
        });
    }
});
}
function signinFunc(req, res) {
  // console.log('req.basicAuth', req.basicAuth)
  if (req.basicAuth) {
  // add the token as cookie 
        res.cookie('token', req.basicAuth.token);
        // add a header
        res.set('token', req.basicAuth.token);
        // send json object with token and user record
        res.status(200).json(req.basicAuth);
    } else {
        res.status(403).send('Invalid login signinHandler');
    }
}

function usersFunc(req, res) {
  console.log('we are in users function');

  if (req.basicAuth.token) {
    users.find().then(result => {
        // res.status(200).json(result);
        res.status(200).json({numberOfUsers: result.length, TheList: result});
    });
} else {
    res.status(403).send('Invalid login ,,,usersHandler ');
}
}

function secretFunc(req,res) {
    res.status(200).json(req.user)
}

module.exports = router;