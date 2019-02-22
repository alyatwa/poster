const mongoose = require('mongoose')

let SourceSchema = new mongoose.Schema(
    {
        name: String,
        followersCount: Number,
        slug: String,
        category: String,
        imgUrl: String,
        platform: String,
        lang: String
    }, {
        timestamps: true
    }
)

module.exports = mongoose.model('Source', SourceSchema)