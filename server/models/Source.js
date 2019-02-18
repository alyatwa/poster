const mongoose = require('mongoose')

let SourceSchema = new mongoose.Schema(
    {
        name: String,
        slug: String,
        category: String,
        imgUrl: String,
        platform: String
    }
)

module.exports = mongoose.model('Source', SourceSchema)