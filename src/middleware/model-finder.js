'use strict';

const users = require('../auth/models/users-model.js');

function gettingModel(req, res, next) {
    let model = req.params.model;
    switch (model) {
  case 'users':
      req.model = users;
      next();
      return;
      default:
          next('Invalid Model');
          return;
        }
    }
    
    module.exports.gettingModel = gettingModel;
    // 'use strict';
    // const signModle = require('../auth/models/users-model');
    
    // module.exports = (req, res, next) => {
    //   const model = req.params.model;
    //   // console.log('__MODEL__', model);
    //   switch (model) {
    //   case 'signup':
    //     req.model = signModle;
    //     break;
    //   case 'signin':
    //     req.model = signModle;
    //     break;
    //   case 'users':
    //       req.model = signModle;
    //       break;
    //   case 'bad':
    //     res.status(500).json({});
    //     break;
    //   default:
    //     res.status(404).json({});
    //     return;
    //   }
    //   next();
    // };