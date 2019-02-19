const Source = require('../models/Source')

module.exports = {
    addSource: (req, res, next) => {
        let {
            name,
            slug,
            category,
            imgUrl,
            platform
        } = req.body
   
        saveSource({
                name,
                slug,
                category,
                imgUrl,
                platform
            })
        

        function saveSource(obj) {
            new Source(obj).save((err, source) => {
                if (err)
                    res.send(err)
                else if (!source)
                    res.send(400)
                else {
                    return res.send(source)
                }
                next()
            })
        }
    },
    /**
     * source_id
     */
    getSource: (req, res, next) => {
        Source.findById(req.params.id).exec((err, source) => {
                if (err)
                    res.send(err)
                else if (!source)
                    res.send(404)
                else
                    res.send(source)
                next()
            })
    },
    /**
     * delete Source
     */
    deleteSource: (req, res, next) => {
        Source.deleteOne({
            _id: req.params.id
        }, (err) => {
            if (err) {
                //return next(err);
            }
            console.log('source deleted!');
            req.flash('info', {
                msg: 'Your Source has been deleted.'
            });
            res.redirect('/dashboard');
        });
        },
    /**
     * edit Source
     */
    editSource: (req, res, next) => {
        Source.findById(req.params.id, (err, source) => {
            source.title = req.body.name || req.source.name;
            source.slug = req.body.slug || req.source.slug;
            source.category = req.body.category || req.source.category;
            source.imgUrl = req.body.imgUrl || req.source.imgUrl;
            source.platform = req.body.platform || req.source.platform;
            source.save((err) => {
                //res.json({ message: 'Successfully edit' });
                req.flash('success', {
                    msg: 'Source information has been updated'
                });
                res.redirect('/source/' + req.params.id);
            });
        })
        }
    }