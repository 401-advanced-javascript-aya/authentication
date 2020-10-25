const mongoose = require('mongoose');

const sign = mongoose.Schema({
  userName: { type: String, require: true },
  Password: { type: String, require: true },
});

module.exports = mongoose.model('sign', sign);