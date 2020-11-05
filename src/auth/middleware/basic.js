'use strict';

const base64 = require('base-64');
const users = require('../models/users-model');

module.exports = (req, res, next) => {
  console.log('req.headers.authorization', req.headers.authorization);
  if (!req.headers.authorization) {
    next('Invalid Login');
  } else {
    const authBasic = req.headers.authorization.split(' ').pop(); 
    console.log('authBasic', authBasic);
    let [userName, pass] = base64.decode(authBasic).split(':'); 
    console.log('__BasicAuth__', userName, pass);
    users.authenticate(userName, pass).then((validUser) => {

      console.log('validUser', validUser);

      req.token = users.generateToken(validUser);
      req.userName = validUser;
      console.log('req.token', req.token);
      next();
    }).catch((err) => next(err));
  }
};