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
