const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  emergencyContact: {
    type: String,
    required: true,
  },
  image: {
    type: Buffer, 
  },
});

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  students: [studentSchema],
});

module.exports = mongoose.model('Class', classSchema);
