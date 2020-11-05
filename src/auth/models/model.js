'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET || 'SECRET';


class Model {
  constructor(schema) {
    this.schema = schema;
  }

  async create(record) {
    'use strict';
    const mongoose = require('mongoose');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    require('dotenv').config();

    const SECRET = process.env.SECRET || 'SECRET';

    const userSchema = mongoose.Schema({
      username: { type: String, required: true },
      password: { type: String, required: true },
      email: { type: String },
      role: { type: String, enum: ['admin', 'editor', 'writer', 'user'] },
    });

    userSchema.pre('save', async function () {
      this.password = await bcrypt.hash(this.password, 5); /// hashing password then save in db
    });

    // user.methods >>>> adding methods to the schema 
    userSchema.methods.comparePasswords = async function (password) {
      const valid = await bcrypt.compare(password, this.password);
      return valid ? this : null;
    };

    userSchema.statics.generateToken = function (username) {
      return jwt.sign({ username: username }, SECRET);
    };


    userSchema.statics.authenticate = async function (username, password) {
      let userInDb = await this.findOne({ username: username });
      if (userInDb) {
        let result = await userInDb.comparePasswords(password);
        return result;
      } else {
        return null;
      }
    };

    userSchema.statics.authenticateToken = async function (token) {

      try {
        let tokenObject = jwt.verify(token, SECRET); // return an object after decoding the token
        console.log('tokenObject ', tokenObject);

        let tokenDB = await this.findOne({ username: tokenObject.username });
        console.log('tokenDB ', tokenDB);

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
    };

    module.exports = mongoose.model('user', userSchema);
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
      admin: ['read', 'read-submisi', 'create', 'update', 'delete'],
    };
    console.log(actions);
    return;
  }

}

module.exports = Model;