const Post = require('./../models/Post')
const Reddit = require('../platform/Reddit')
const Instagram = require('../platform/Instagram')
const Twitter = require('../platform/Twitter')
const Imgur = require('../platform/Imgur')
const Tumblr = require('../platform/Tumblr')

module.exports = {
    addPost: async (req, res, next) => {
        var post, slug, url = req.body.url;
        var platform = new URL(url).host.split('.').reverse()[1];
        if (platform === 'tumblr') {
            slug = url.split('.')[0].split('//')[1]
        } else if (platform === 'reddit') {
            slug = url.split('/')[6]
        } else {
            slug = url.split('/')[3]
        }
        console.log(slug, ' ', platform);

        if (platform === 'reddit') {
            post = await Reddit.getPost(req.body)
            res.send(post)
            /*if (post.code) {
                res.send(post)
                return;
            }*/
        } else if (platform === 'instagram') {
            post = await Instagram.getPost(req.body)
            res.send(post)
        } else if (platform === 'twitter') {
            post = await Twitter.getPost(req.body)
            res.send(post)
        } else if (platform === 'imgur') {
            post = await Imgur.getPost(req.body)
            res.send(post)
        } else if (platform === 'tumblr') {
            post = await Tumblr.getPost(req.body)
            res.send(post)
        }
        
        
        /*let {
            title,
            description,
            category,
            img,
            template,
            author
        } = req.body
        savePost({
                title,
                description,
                category,
                usedTimes:0,
                img,
                template,
                author
            })
        

        function savePost(obj) {
            new Post(obj).save((err, post) => {
                if (err)
                    res.send(err)
                else if (!post)
                    res.send(400)
                else {
                    return post.addAuthor(req.user.id).then((_post) => {
                        return res.send(_post)
                    })
                }
                next()
            })
        }*/
    },
    getAll: (req, res, next) => {
        Post.find(req.params.id)
            .populate('author').exec((err, post) => {
                if (err)
                    res.send(err)
                else if (!post)
                    res.send(404)
                else
                    res.send(post)
                next()
            })
    },

    /**
     * post_id
     */
    addUsedTimes: (req, res, next) => {
        Post.findById(req.params.id).then((post) => {
            return post.used().then((post) => {
                return res.json({post})
                //res.redirect('/post/' + req.params.id);
            })
        }).catch(next)
    },

    /**
     * post_id
     */
    getPost: (req, res, next) => {
        Post.findById(req.params.id)
            .populate('author').exec((err, post) => {
                if (err)
                    res.send(err)
                else if (!post)
                    res.status(404).send({
                        code: "INVALID_POST",
                        msg: "Oh uh, Post not found"
                    })
                else
                    res.send(post)
                next()
            })
    },
    /**
     * delete Post
     */
    deletePost: (req, res, next) => {
        Post.findOne({
                    _id: req.params.id
                }, function (err, post) {
                    if (!post)
                        {res.status(404).send({
                            code: "INVALID_POST",
                            msg: "Oh uh, Post not found"
                        })} else {
                            Post.deleteOne({
                                _id: req.params.id
                            }, (err) => {
                                if (err) {
                                    //return next(err);
                                    console.log(err);
                                }
                                console.log('post deleted!');
                                req.flash('info', {
                                    msg: 'Your Post has been deleted.'
                                });
                                res.redirect('/dashboard');
                            });
                        }
                })


        
        },
    /**
     * edit Post
     */
    editPost: (req, res, next) => {
        Post.findById(req.params.id, (err, post) => {
            post.title = req.body.title || req.post.title;
            post.description = req.body.description || req.post.description;
            post.category = req.body.title || req.post.category;
            post.save((err) => {
                //res.json({ message: 'Successfully edit' });
                req.flash('success', {
                    msg: 'Post information has been updated'
                });
                res.redirect('/post/' + req.params.id);
            });
        })
        }
    }