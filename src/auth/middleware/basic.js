'use strict';

const base64 = require('base-64');
const users = require('../models/users-schema');

module.exports = (req, res, next) => {
  console.log('req.headers.authorization', req.headers.authorization);
  if (!req.headers.authorization) {
    next('Missing Headers!');
    return;

  }
  const authBasic = req.headers.authorization.split(' ').pop(); // ["basic YWhtYWRfc2hlbGEgOjEyMzQ="]
  console.log('authBasic', authBasic);

  let [username, pass] = base64.decode(authBasic).split(':'); // "Raghad:1234"
  console.log('__BasicAuth__', username, pass);
  users.authenticate(username, pass).then(validUser => {
    console.log('validUser ....basic', validUser);
    if (!validUser) {
      return next('Wrong Useranem or Password');
    }
    console.log('validUser', validUser);

    let token = users.generateToken(validUser.username);
    if (token) {
      req.basicAuth = {
        token: token,
        user: validUser,
      };
    }
    next();

  }).catch(err => next(err));


};