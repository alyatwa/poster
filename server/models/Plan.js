const mongoose = require('mongoose')

let PlanSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        price: Number,
        credits: Number
        
    }
)

module.exports = mongoose.model('Plan', PlanSchema)