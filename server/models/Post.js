const mongoose = require('mongoose')

let PostSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        category: String,
        usedTimes: Number,
        img: String,
        video: String,
        gif: String,
        type: String,
        permalink: String,
        originalId: String,
        slug: String,
        likes: Number,
        comments: Number,
        lang: String,
        template: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Template'
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }, {
        timestamps: true
    }
);
PostSchema.methods.used = function () {
    this.usedTimes++
    return this.save()
}
PostSchema.methods.addAuthor = function (user_id) {
    this.author = user_id
    return this.save()
}
/*PostSchema.methods.getUserPosts = function (_id) {
        Post.find({
            'user': _id
        }).then((posts) => {
            return posts
        })
}*/
module.exports = mongoose.model('Post', PostSchema)