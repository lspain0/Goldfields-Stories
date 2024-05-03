//classModel.js is a model for the class collection in the database. 
//It contains the schema for the class collection. The class collection contains the following fields:


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
  image: {
    type: String, 
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
