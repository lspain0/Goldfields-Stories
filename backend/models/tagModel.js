//this file contains the model for a tag set entry on the mongodb database

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagSchema = new Schema({
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Tag', tagSchema);
