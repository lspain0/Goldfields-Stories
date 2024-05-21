//This file contains the model for a story entry on the mongodb database

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const storySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    children: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        required: false
    }

}, { timestamps: true })

module.exports = mongoose.model('Story', storySchema)

