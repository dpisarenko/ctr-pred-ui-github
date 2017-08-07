'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FilesSchema = new Schema({
  email:String,
  filename:String
});

module.exports = mongoose.model('File', FilesSchema);