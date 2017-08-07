'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsersSchema = new Schema({
  email:String,
  pwHash:String,
  activated:Boolean,
  rejected:Boolean
});

module.exports = mongoose.model('User', UsersSchema);