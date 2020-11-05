'use strict';
const User = require('../models/users-model');

module.exports = (action) => {
    return (req, res, next) => {
       console.log("in acl middleware !!! ")
        console.log(req.user); // this is coming from the bearerMiddleware.
        
        try {
            let role = req.user.role;

            if (User.accessPermission(role, action)) {
                next();
            } else {
                // you have actions but you are trying 
                // to access a route that you dont have access on.
                next(' Access Denied ! ')
            }
        } catch (e) {
            next('Invalid!');
        }
    };
}