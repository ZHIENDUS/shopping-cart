var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  imagePath: {type: String, required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},
  type: {type: String, required: true},
  publisher: {type: String, required: true}
});

// Virtual for this book instance URL
schema
.virtual('url')
.get(function () {
  return '/'+this._id
});

module.exports = mongoose.model('Product', schema);
