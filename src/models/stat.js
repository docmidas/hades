//stat MODEL
var mongoose = require('mongoose');
/////////
//Constructor function
var StatSchema = new mongoose.Schema({
  state: String,
  age_group: String,
  gender: String,
  icd: String,
  deaths: Number
  
});
///////
module.exports = mongoose.model('Stat', StatSchema);
