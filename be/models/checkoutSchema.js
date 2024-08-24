const mongoose = require('mongoose');
const Product = require('./Product'); // Import Product model

const checkoutSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  apartmentSuite: {
    type: String,
    default: '' // Optional field, defaults to an empty string if not provided
  },
  city: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    default: '' // Optional field, defaults to an empty string if not provided
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Ensure 'Product' matches the name in your Product model
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ]
}, { timestamps: true });

const Checkout = mongoose.model('Checkout', checkoutSchema);

module.exports = Checkout;
