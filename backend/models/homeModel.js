const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HomeImage', homeSchema);
