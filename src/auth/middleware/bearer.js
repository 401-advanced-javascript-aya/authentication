const Users = require('../models/users-schema');
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login');
  } else {
    // 'bearer aldssalkasdj.334sdfasdasds.dfdsf2sda3'
    const token = req.headers.authorization.split(' ').pop();
    console.log('__TOKEN__', token);
    Users.authenticateToken(token).then((validUser) => {
        req.user = validUser;
        next();
      }).catch(() => {
        next('Invalid Login');
      });
  }
};