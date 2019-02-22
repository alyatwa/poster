let Instagram = require('instagram-nodejs-without-api');
var Instausername = process.env.Instausername
var Instapass = process.env.Instausername

Instagram = new Instagram()

module.exports = {
    getUser: (user) => {
        return new Promise(resolve => {
        var username = user.url.split('/')[3];
        console.log('username: ', username);
        var platform = 'instagram'
        Instagram.getCsrfToken().then((csrf) => {
            Instagram.csrfToken = csrf;
        }).then(() => {
            return Instagram.auth(Instausername, Instapass).then(sessionId => {
                Instagram.sessionId = sessionId
                return Instagram.getUserDataByUsername(username).then((data) => {
                    //console.log(data);
                    
                    let obj = {
                        slug: username,
                        imgUrl: data.graphql.user.profile_pic_url_hd,
                        platform,
                        category: user.category,
                        lang: user.lang,
                        name: data.graphql.user.full_name,
                        originalId: data.graphql.user.id,
                        followersCount: data.graphql.user.edge_followed_by.count
                    }
                    return resolve(obj)
                    /*return Instagram.getUserFollowers(t.graphql.user.id).then((t) => {
                        //console.log(t); // - instagram followers for user "username-for-get"
                        //return resolve(t)
                    })*/
                })

            })
        }).catch((err)=>{
            return resolve({code: 'ERROR_PROFILE', msg:'Profile not found!'})
        })
        })
    }
}