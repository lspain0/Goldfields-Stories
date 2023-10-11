const mongoose = require('mongoose')

const Schema = mongoose.Schema

const storySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model('Story', storySchema)

