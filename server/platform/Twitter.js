var Twit = require('twit')
var T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

module.exports = {
    getUser: (user) => {
        return new Promise(resolve => {
            let username = user.url.match('((https?://)?(www\.)?twitter\.com/)?(@|#!/)?([A-Za-z0-9_]{1,15})(/([-a-z]{1,20}))?')[5];
            let img = `https://twitter.com/${username}/profile_image?size=original`
            let platform = 'twitter'
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
    }
}