/** */
const Post = require('./../models/Post')

module.exports = {
    addPost: (req, res, next) => {
        let {
            title,
            description,
            category,
            usedTimes,
            img,
            template,
            author
        } = req.body
        //let obj = { text, title, claps, description, feature_img: _feature_img != null ? `/uploads/${_filename}` : '' }
       
        savePost({
                title,
                description,
                category,
                usedTimes,
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
        }
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
        Post.findById(req.body.post_id).then((post) => {
            return post.used().then(() => {
                return res.json({
                    msg: "Done"
                })
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
                    res.send(404)
                else
                    res.send(post)
                next()
            })
    },
    /**
     * delete Post
     */
    deletePost: (req, res, next) => {
        Post.deleteOne({
            _id: req.params.id
        }, (err) => {
            if (err) {
                //return next(err);
            }
            console.log('post deleted!');
            req.flash('info', {
                msg: 'Your Post has been deleted.'
            });
            res.redirect('/dashboard');
        });
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