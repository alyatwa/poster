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
    },
    getPost: (post) => {
        return new Promise(resolve => {
        var postId = post.url.split('/')[4];
        var blogName = post.url.split('.')[0].split('//')[1];
        var platform = 'tumblr', obj
        client.blogPosts(blogName + '.tumblr.com', { id: postId }, function (err, info) {
            if (err) {
                return resolve({
                    code: 'ERROR_POST',
                    msg: 'Post not found!'
                })
            } else {
                let data = info.posts[0]
                let type
                if (data.type === 'photo') {
                    type = 'image'
                } else if (data.type === 'video') {
                    type = 'video'
                } else if (data.type === 'audio') {
                    type = 'audio'
                }
                obj = {
                slug: data.blog.name,
                platform,
                permalink: data.post_url,
                category: post.category,
                originalId: postId,
                lang: post.lang,
                type,
                img: ((type === 'image') ? data.photos[0].original_size.url : undefined),
                video: ((type === 'video') ? data.video_url : undefined),
                likes: data.note_count,
                title: data.caption,
                publishedDate: new Date(data.timestamp * 1000).toISOString(),
                description: ((data.summary) ? data.summary : undefined)
                }
            return resolve(obj)
        }
            });
        });
    }
}