const mongoose = require('mongoose')

let SavedSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule'
    }
})

module.exports = mongoose.model('Saved', SavedSchema)