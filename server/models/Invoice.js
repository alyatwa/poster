const mongoose = require('mongoose')

let InvoiceSchema = new mongoose.Schema(
    {
        user: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
        subscription: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Subscription'
            },
        plan: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Plan'
            }
        
    }
)

module.exports = mongoose.model('Invoice', InvoiceSchema)