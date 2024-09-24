const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street : String,
  city : String,
  state : String,
  zip : String,
  landmark : String,
  mobile : { type: String, match: /[0-9]{10}/ },
  
  
});

module.exports = mongoose.model("Address", addressSchema);
