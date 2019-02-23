const tumblr = require('tumblr.js');
const client = tumblr.createClient({
    consumer_key: process.env.CONSUMER_KEY_TUMBLR,
    consumer_secret: process.env.CONSUMER_SECRET_TUMBLR,
    token: process.env.ACCESS_TOKEN_TUMBLR,
    token_secret: process.env.ACCESS_SECRET_TUMBLR
});
module.exports = {
    getUser: (blog) => {
        return new Promise(resolve => {
        var blogName = blog.url.split('.')[0].split('//')[1];
        var platform = 'tumblr', obj
        client.blogInfo(blogName + '.tumblr.com', (err, data) => {
            if (err) {
                return resolve({
                    code: 'ERROR_PROFILE',
                    msg: 'Profile not found!'
                })
            } else {
            client.blogAvatar(blogName + '.tumblr.com', function (err, ava) {
            obj = {
                slug: blogName,
                imgUrl: ava.avatar_url,
                platform,
                category: blog.category,
                originalId: data.blog.uuid,
                lang: blog.lang,
                name: data.blog.title
            }
            return resolve(obj)
            });}
            });
        });
    }
}