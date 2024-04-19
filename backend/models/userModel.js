const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: ""
    },
    child: {
        type: String,
        default: ""
    },
    code1: {
        type: String,
        default: ""
    },
    code2: {
        type: String,
        default: ""
    },

    code3: {
        type: String,
        default: ""
    },

    code4: {
        type: String,
        default: ""
    },

    code5: {
        type: String,
        default: ""
    },

    code6: {
        type: String,
        default: ""
    },

    code7: {
        type: String,
        default: ""
    },

    code8: {
        type: String,
        default: ""
    },

    code9: {
        type: String,
        default: ""
    },

    code10: {
        type: String,
        default: ""
    }

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)