/** */
const Source = require('../models/Source')

module.exports = {
    addSource: (req, res, next) => {
        let {
            title,
            description,
            category,
            img,
            template,
            author
        } = req.body
        //let obj = { text, title, claps, description, feature_img: _feature_img != null ? `/uploads/${_filename}` : '' }
       
        saveSource({
                title,
                description,
                category,
                usedTimes:0,
                img,
                template,
                author
            })
        

        function saveSource(obj) {
            new Source(obj).save((err, source) => {
                if (err)
                    res.send(err)
                else if (!source)
                    res.send(400)
                else {
                    return source.addAuthor(req.user.id).then((_source) => {
                        return res.send(_source)
                    })
                }
                next()
            })
        }
    },
    /**
     * source_id
     */
    getSource: (req, res, next) => {
        Source.findById(req.params.id)
            .populate('author').exec((err, source) => {
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
            source.title = req.body.title || req.source.title;
            source.description = req.body.description || req.source.description;
            source.category = req.body.title || req.source.category;
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