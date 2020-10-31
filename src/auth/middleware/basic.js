'use strict';

const base64 = require('base-64');
const users = require('../models/users-schema');
module.exports = (req, res, next) => {
    // check if the client sent authorization headers
    console.log('req.headers.authorization', req.headers);
    if (!req.headers.authorization) {
      next('Missing Headers!');
      return;
  
    }  
      // user:pass
      const authBasic = req.headers.authorization.split(' ').pop(); // ["basic YWhtYWRfc2hlbGEgOjEyMzQ="]
      console.log('authBasic', authBasic);
  
      let [username, pass] = base64.decode(authBasic).split(':'); // "aya:1234"
      // const [userName, pass] = base64.decode(auth[1]).split(':'); /// if we did not use pop
      console.log('__BasicAuth__', username, pass);
      // we have the user obj
      users.authenticate(username, pass).then(validUser => {
        console.log('validUser ....basic',validUser)
        if (!validUser) {
          return next('Wrong Useranem or Password');
        }
        // generate a token for this user and return
        console.log('validUser', validUser);
  
        let token = users.generateToken(validUser.username);
        if (token) {
          req.basicAuth = {
            token: token,
            user: validUser
          }
        }
        next();
  
      }).catch(err => next(err));
  
    
  };
  