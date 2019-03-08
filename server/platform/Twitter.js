var Twitter = require('twit')
var T = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})
const platform = 'twitter'
module.exports = {
    getUser: (user) => {
        return new Promise(resolve => {
            let username = user.url.match('((https?://)?(www\.)?twitter\.com/)?(@|#!/)?([A-Za-z0-9_]{1,15})(/([-a-z]{1,20}))?')[5];
            let img = `https://twitter.com/${username}/profile_image?size=original`
            
            T.get('users/show', {
                screen_name: username
            }, function (err, data, response) {
                if (err) {
                    return resolve({
                        code: 'ERROR_PROFILE',
                        msg: 'Profile not found!'
                    })
                } else {
                let obj = {
                    slug: username,
                    imgUrl: img,
                    platform,
                    category: user.category,
                    originalId: data.id,
                    lang: user.lang,
                    name: data.name,
                    followersCount: data.followers_count
                }
                return resolve(obj)}
            })
        })
        // return {username, img, platform}
    },
    getPost: (post) => {
        return new Promise(resolve => {
            let tweetId = post.url.split('/')[5];
            T.get('statuses/show/:id' , {
                id: tweetId
            }, function (err, data, response) {
                if (err) {
                    console.log(err);
                    return resolve({
                        code: 'ERROR_POST',
                        msg: 'Post not found!'
                    })
                } else {
                    
                    if (data.extended_entities) {
                        var type = data.extended_entities.media[0].type;
                        if (type === 'animated_gif') {
                            type = 'gif'
                        } else if (type === 'video') {
                            type = 'video'
                        } 
                    } else if (!data.entities.media){
                        type = 'text'
                    }
                    console.log(type);
                let obj = {
                    slug: data.user.screen_name,
                    likes: data.favorite_count,
                    comments: data.num_comments,
                    platform,
                    category: post.category,
                    originalId: tweetId,
                    lang: post.lang,
                    img: ((type === 'text') ? data.entities.media[0].media_url_https : undefined),
                    video: ((type === 'video') ? data.extended_entities.media[0].video_info.variants[0].url : undefined),
                    gif: ((type === 'gif') ? data.extended_entities.media[0].video_info.variants[0].url : undefined),
                    type,
                    title: data.text,
                    publishedDate: data.created_at
                }
                return resolve(obj)}
            })
        })
        // return {username, img, platform}
    }
}