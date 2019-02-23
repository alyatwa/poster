const snoowrap = require('snoowrap');
const r = new snoowrap({
    userAgent: 'bo',
    clientId: process.env.CONSUMER_KEY_Reddit,
    clientSecret: process.env.CONSUMER_SECRET_Reddit,
    username: process.env.ACCESS_TOKEN_Reddit,
    password: process.env.ACCESS_SECRET_Reddit
});

module.exports = {
    getUser: (user) => {
        return new Promise(resolve => {
            let username = user.url.split('/')[4];
            let platform = 'reddit'
            
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
    }
}