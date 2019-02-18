const mongoose = require('mongoose')

let SubscriptionSchema = new mongoose.Schema({

    startTime: Date,
    endTime: Date,
    credits: Number,
    renewed: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    }
})

module.exports = mongoose.model('Subscription', SubscriptionSchema)