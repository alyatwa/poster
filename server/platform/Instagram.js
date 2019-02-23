let Instagram = require('instagram-nodejs-without-api');
var Instausername = process.env.Instausername
var Instapass = process.env.Instausername
Instagram = new Instagram()
const platform = 'instagram'
const Instagram2 = require('instagram-web-api')
const FileCookieStore = require('tough-cookie-filestore2')
const cookieStore = new FileCookieStore('./cookies.json')
const client = new Instagram2({
    Instausername,
    Instapass,
    cookieStore
})
module.exports = {
    getUser: (user) => {
        return new Promise(resolve => {
        var username = user.url.split('/')[3];
        console.log('username: ', username);
        
        Instagram.getCsrfToken().then((csrf) => {
            Instagram.csrfToken = csrf;
        }).then(() => {
            return Instagram.auth(Instausername, Instapass).then(sessionId => {
                Instagram.sessionId = sessionId
                return Instagram.getUserDataByUsername(username).then((data) => {
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
                })

            })
        }).catch((err)=>{
            return resolve({code: 'ERROR_PROFILE', msg:'Profile not found!'})
        })
        })
    },
    getPost: (post) => {
        return new Promise(resolve => {
            var postId = post.url.split('/')[4];
            (async () => {
                const data = await client.getMediaByShortcode({
                    shortcode: postId
                })
                let type;
                if (data.__typename === 'GraphImage' || data.__typename === 'GraphSidecar') {
                    type = 'image'
                } else if (data.__typename === 'GraphVideo') {
                    type = 'video'
                }
                console.log(type, "@@@ ", data.__typename);
                let obj = {
                    slug: data.owner.username,
                    likes: data.edge_media_preview_like.count,
                    comments: data.edge_media_to_comment.count,
                    permalink: data.permalink,
                    platform,
                    category: post.category,
                    originalId: postId,
                    lang: post.lang,
                    img: ((data.thumbnail_src) ? data.thumbnail_src : data.display_url),
                    video: ((data.is_video) ? data.video_url : undefined),
                    type,
                    title: data.edge_media_to_caption.edges[0].node.text,
                }
                return resolve(obj)
            })()
        })
    }
}





