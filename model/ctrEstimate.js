'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CtrEstimatesSchema = new Schema({
  email:String,
  keywords:String,
  ctrEstimate:Number
})

module.exports = mongoose.model('CtrEstimate', CtrEstimatesSchema)