'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DataProcessingErrorsSchema = new Schema({
  email:String,
  message:String
})

module.exports = mongoose.model('DataProcessingError', DataProcessingErrorsSchema);