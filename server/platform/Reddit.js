const snoowrap = require('snoowrap');
const r = new snoowrap({
    userAgent: 'bo',
    clientId: process.env.CONSUMER_KEY_Reddit,
    clientSecret: process.env.CONSUMER_SECRET_Reddit,
    username: process.env.ACCESS_TOKEN_Reddit,
    password: process.env.ACCESS_SECRET_Reddit
});
const platform = 'reddit'
module.exports = {
    getUser: (user) => {
        return new Promise(resolve => {
            let username = user.url.split('/')[4];
            r.getUser(username).fetch().then(data => {
                let obj = {
                    slug: username,
                    imgUrl: data.icon_img,
                    platform,
                    category: user.category,
                    originalId: data.id,
                    lang: user.lang,
                    name: data.subreddit.display_name.display_name
                }
                return resolve(obj)
            }).catch(err => {
                return resolve({
                    code: 'ERROR_PROFILE',
                    msg: 'Profile not found!'
                })
            });
            
            
        })
    },
    getPost: (post) => {
        return new Promise(resolve => {
            let postId = post.url.split('/')[6];
            r.getSubmission(postId).fetch().then(data => {
                let type;
                if (data.post_hint) {
                    if (data.post_hint === 'image') {
                        type = 'image'
                    } else if (data.post_hint === 'hosted:video') {
                        type = 'video'
                    } else if (data.post_hint === 'rich:video') {
                        type = 'gif'
                    } else if (data.post_hint === 'link') {
                        type = 'link'
                    }
                } else {
                    type = 'text'
                }
                console.log(type);
                
                let obj = {
                    slug: data.author.name,
                    imgUrl: data.icon_img,
                    likes: data.ups,
                    permalink: data.permalink,
                    platform,
                    category: post.category,
                    originalId: postId,
                    lang: post.lang,
                    img: ((data.preview) ? data.preview.images[0].source.url : data.url),
                    video: ((data.is_video) ? data.media.reddit_video.fallback_url : undefined),
                    gif: ((type === 'gif' && data.media) ? data.media.oembed.thumbnail_url : undefined),
                    type,
                    title: data.title,
                    description: data.selftext
                }
                return resolve(obj)
            }).catch(err => {
                console.log(err);
                
                return resolve({
                    code: 'ERROR_POST',
                    msg: 'Post not found!'
                })
            });
            
            
        })
    }
}