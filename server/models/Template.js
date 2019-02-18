const mongoose = require('mongoose')

let TemplateSchema = new mongoose.Schema(
    {
        
        dimensions: {
            height: Number,
            width: Number
        },
        img: {
            data: Buffer,
            contentType: String
        }
    }
)

module.exports = mongoose.model('Template', TemplateSchema)