const users = require('../models/users-schema.js');
const superagent = require('superagent');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

module.exports = async (req, res, next) => {
  // 1 - get the code
  // 2- exchange code with token
  // 3- i have the token, exchange token with user
  // 4- save user to my db

  console.log('req.query ---------> ', req.query);
  let code = req.query.code;
  console.log('(1) code : ', code);

  let token = await exchangeCodeWithToken(code);
  console.log('(2) token  -- From exchangeCodeWithToken ---> ', token);

  let user = await exchangeTokenWithUser(token);
  console.log('(3) GITHUB USER', user);

  let [savedUser, serverToken] = await saveUser(user);

  req.user = savedUser;
  req.token = serverToken;
  console.log('(4) LOCAL USER', savedUser);
  next();

};

async function exchangeCodeWithToken(code) {
  const urlToGetToken = 'https://github.com/login/oauth/access_token';
  const response = await superagent.post(urlToGetToken).send({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
    redirect_uri: 'https://auth-aya.herokuapp.com/oauth',
  });
  console.log('exchangeCodeWithToken response ----> ', response.body);
  return response.body.access_token;
}

async function exchangeTokenWithUser(token) {
  let userResponse = await superagent
    .get('https://api.github.com/user')
    .set('Authorization', `token ${token}`)
    .set('User-Agent', 'user-agent/1.0');

  console.log('userResponse.body: ', userResponse.body);
  return userResponse.body;
}

async function saveUser(user) {
  console.log('user::::::::::::::: ', user);
  try {
    let record = {
      username: user.login,
      password: '0000',
    };
    let newUser = new users(record);
    let savedUser = await newUser.save();
    let myserverToken = users.generateToken(savedUser);
    console.log('savedUser', savedUser);
    console.log('myserverToken', myserverToken);
    return [savedUser, myserverToken];

  } catch (e) {
    return Promise.reject();
  }
}
