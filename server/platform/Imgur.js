var imgur = require('imgur');
imgur.setClientId(process.env.IMGUR_CLIENT_ID);
imgur.setAPIUrl('https://api.imgur.com/3/');

module.exports = {
    getPost: (post) => {
        return new Promise(resolve => {
        var imgId = post.url.split('/')[4];
        var platform = 'imgur', obj
        imgur.getInfo(imgId)
            .then(function (data) {
                let type;
                if (data.type === 'image/gif') {
                        type = 'gif'
                    } else if (data.type === 'image/jpeg') {
                        type = 'image'
                    } else if (data.type === 'video/mp4') {
                        type = 'video'
                    } 
                let obj = {
                    platform,
                    category: post.category,
                    originalId: data.id,
                    lang: post.lang,
                    img: ((type === 'image') ? data.link : undefined),
                    video: ((data.has_sound) ? data.mp4 : undefined),
                    gif: ((type === 'gif') ? data.link : undefined),
                    type,
                    title: data.title,
                    publishedDate: new Date(data.datetime * 1000).toISOString(),
                    description: ((data.description) ? data.description : undefined)
                }
                return resolve(obj)
            })
            .catch(function (err0) {
                imgur.getAlbumInfo(imgId)
                    .then(function (info) {
                        let data = info.data.images[0]
                        if (data.type === 'image/gif') {
                            type = 'gif'
                        } else if (data.type === 'image/jpeg') {
                            type = 'image'
                        } else if (data.type === 'video/mp4') {
                            type = 'video'
                        }
                        let obj = {
                            platform,
                            category: post.category,
                            originalId: data.id,
                            lang: post.lang,
                            img: ((type === 'image') ? data.link : undefined),
                            video: ((data.has_sound) ? data.mp4 : undefined),
                            gif: ((type === 'gif') ? data.link : undefined),
                            type,
                            title: info.data.title,
                            publishedDate: new Date(data.datetime * 1000).toISOString(),
                            description: ((info.data.description) ? info.data.description : undefined)
                        }
                        return resolve(obj)
                    })
                    .catch(function (err) {
                        return resolve({
                            code: 'ERROR_POST',
                            msg: 'Post not found!'
                        })
                    });
            });
            });
    }
}