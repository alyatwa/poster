const mongoose = require('mongoose')

let ScheduleSchema = new mongoose.Schema({

    startTime: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
})

module.exports = mongoose.model('Schedule', ScheduleSchema)