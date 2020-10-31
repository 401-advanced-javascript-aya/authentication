'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET || 'SERR';


class Model {
  constructor(schema) {
    this.schema = schema;
  }


  async create(record) {

    console.log('recorde', record);
    let addedUserName = await this.schema.find({ username: record.username });
    await console.log('searching user .... ', addedUserName);


    if (addedUserName.length === 0) { 
      record.password = await bcrypt.hash(record.password, 5);

      let newRecord = new this.schema(record);
      console.log('hashed record >>>>> ', newRecord);
      return await newRecord.save();
    }
    return ' user is exist';
  }

  async authenticate(user, pass) {
    
    let userInDb = await this.schema.findOne({ username: user });
    let valid = await bcrypt.compare(pass, userInDb.password);
    let returnValue = valid ? userInDb : 'wrong password !!';
    console.log('returnValue', returnValue);
    return returnValue;
  }

  async list() {

    let allUsers = await this.schema.find();
    console.log('inside list', allUsers);

    return allUsers;
  }

  generateToken(user) {
    let token = jwt.sign({ username: user.username }, SECRET);
    return token;
  }



  async authenticateToken(token) {
    try {
      let tokenObject = jwt.verify(token, SECRET);
      console.log('token..........', token);
      console.log('tokenObject----->', tokenObject);

     let tokenDB = await this.schema.find({ username: tokenObject.username });
      
      console.log('tokenDB -----> ', tokenDB);



      if (tokenDB) {
        return Promise.resolve({
          tokenObject: tokenObject,
          user: tokenObject.username,
        });

      } else {
        return Promise.reject();
      }

    } catch (e) {
      return Promise.reject();
    }

  }
  accessPermission(role, action) {
    let actions = {
      user: ['read'],
      writer: ['read', 'create'],
      editor: ['read', 'create', 'update'],
      admin: ['read', 'read-submisi', 'create', 'update', 'delete']

    };
return 
  }

}

module.exports = Model;