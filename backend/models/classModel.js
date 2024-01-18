// models/Class.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
  // Add any other student fields if necessary
});

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  students: [studentSchema] // Adding an array of student objects
});

module.exports = mongoose.model('Class', classSchema);
