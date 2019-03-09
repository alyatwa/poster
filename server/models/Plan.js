const mongoose = require('mongoose')

let PlanSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        price: Number,
        frequency: String,
        type: String,
        paypalURLBtn: String
        
    }, {
        timestamps: true
    }
)

module.exports = mongoose.model('Plan', PlanSchema)