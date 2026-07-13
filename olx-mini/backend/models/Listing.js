const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Furniture', 'Vehicles', 'Fashion', 'Books', 'Other']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold'],
    default: 'available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);