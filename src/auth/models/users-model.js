'use strict';

const userModel = require('./users-collection');
const jwt = require('jsonwebtoken');
const Collection = require('../models/mongo');
const SECRET = process.env.SECRET || 'mySecret'
class Users extends Collection {
  constructor() {
    super(userModel);
  }
  async save (record) {
    console.log('userscollection page: record',record)

    // Hash the plain text password given before you save a user to the database
    let userDB = await this.get( record.username );
    console.log('userscollection page: userDB before',userDB)
    // 
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
    let userDB = await this.get({ username: user });
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
  }

  authenticateToken = async function (token) {
    try {
      const tokenObject = jwt.verify(token, SECRET);
      console.log('TOKEN OBJECT', tokenObject);
      let userDB = await this.get( tokenObject );
      if (userDB) {
        return Promise.resolve(tokenObject);
      } else {
        return Promise.reject();
      }
    } catch (e) {
      return Promise.reject(e.message);
    }
  }
  
  list(record){
    console.log('lllllllllllll',record);
   return this.get(record);
  }

}

module.exports = new Users();