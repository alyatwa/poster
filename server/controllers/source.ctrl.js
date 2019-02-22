const Source = require('../models/Source')
const Twitter = require('../platform/Twitter')

module.exports = {
    addSource:  (req, res, next) => {
        let slug = req.body.url.match('((https?://)?(www\.)?twitter\.com/)?(@|#!/)?([A-Za-z0-9_]{1,15})(/([-a-z]{1,20}))?')[5];
        var platform = req.body.url.split('.').reverse()[1].split('//').reverse()[0];
        
        Source.findOne({
            'slug': slug
        },async function (err, checksource) {
            if (checksource) {
                res.json({
                    code: 'SOURCE_INVALID',
                    msg: 'source already added!'
                })
            } else {
                if (platform === 'twitter') {
                    var profile = await Twitter.getUser(req.body)
                }
                new Source(profile).save((err, source) => {
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
        })
    },
    /**
     * source_id
     */
    getSource: (req, res, next) => {
        Source.findById(req.params.id).exec((err, source) => {
                if (err)
                    res.send(err)
                else if (!source)
                    res.status(404).send({
                        code: "INVALID_SOURCE",
                        msg: "Oh uh, Source not found"
                    })
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