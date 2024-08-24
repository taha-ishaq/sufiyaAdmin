// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  tags: { type: [String], required: true },
  mainImage: { type: String, required: true },
  secondaryImages: { type: [String], default: [] },
  size: { type: String, enum: ['XS', 'S', 'M', 'L'], default: null },
  length: { type: Number, default: null },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
