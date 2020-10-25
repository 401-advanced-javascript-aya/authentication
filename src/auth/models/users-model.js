'use strict';

const userModel = require('./users-collection');
const Collection = require('../mongo');

class Users extends Collection {
  constructor() {
    super(userModel);
  }
  async save (record) {
    console.log('userscollection page: record',record)

    // Hash the plain text password given before you save a user to the database
    let userDB = await USERS.findOne({ username: record.username });
    console.log('userscollection page: userDB before',userDB)
    if (!userDB) {
      record.password = await bcrypt.hash(record.password, 5);
      userDB = record;
      console.log('userscollection page: userDB after',userDB)
      return record;
    }
    return Promise.reject();
  };

  // Create a method in the schema to authenticate a user using the hashed password
  async authenticateBasic (user, password) {
    let userDB = await USERS.findOne({ username: user });
    console.log('userscollection page: userDB (authenticatebasic function)',userDB)

    if (userDB) {
    const valid = await bcrypt.compare(password, userDB.password);
    return valid ? userDB : Promise.reject();
  };
  return Promise.reject();
};
  
  
  // Create a method in the schema to generate a Token following a valid login
  async generateToken (user) {
    const token = jwt.sign({ username: user.username }, SECRET);
    return token;
  };
  
  list(_id){
   return Users.find({});
  }

}

module.exports = new Users();