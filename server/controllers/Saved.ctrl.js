const Saved = require('../models/Saved')

module.exports = {
    addSaved: (req, res, next) => {
        saveSaved({
            isPublished: false,
            isScheduled: false,
            user: req.user.id,
            post: req.params.id
        })
        function saveSaved(obj) {
            new Saved(obj).save((err, saved) => {
                if (err)
                    res.send(err)
                else if (!saved)
                    res.send(400)
                else 
                    return res.send(saved) 
                           res.status(200).send({
                        code: "POST_SAVED",
                        msg: saved
                    })
                next()
            })
        }
    },
    getAll: (req, res, next) => {
        Saved.find(req.params.id)
            .populate('author').exec((err, saved) => {
                if (err)
                    res.send(err)
                else if (!saved)
                    res.send(404)
                else
                    res.send(saved)
                next()
            })
    },
    /**
     * saved_id
     */
    getSaved: (req, res, next) => {
        Saved.findById(req.params.id)
            .populate('author').exec((err, saved) => {
                if (err)
                    res.send(err)
                else if (!saved)
                    res.status(404).send({
                        code: "INVALID_POST",
                        msg: "Oh uh, Saved not found"
                    })
                else
                    res.send(saved)
                next()
            })
    },
    /**
     * delete Saved
     */
    deleteSaved: (req, res, next) => {
        Saved.findOne({
                    _id: req.params.id
                }, function (err, saved) {
                    if (!saved)
                        {res.status(404).send({
                            code: "INVALID_Saved",
                            msg: "Oh uh, Saved not found"
                        })} else {
                            Saved.deleteOne({
                                _id: req.params.id
                            }, (err) => {
                                if (err) {
                                    //return next(err);
                                    console.log(err);
                                }
                                console.log('saved deleted!');
                                req.flash('info', {
                                    msg: 'Your Saved has been deleted.'
                                });
                                res.redirect('/dashboard');
                            });
                        }
                })


        
        },
    /**
     * edit Saved
     */
    editSaved: (req, res, next) => {
        Saved.findById(req.params.id, (err, saved) => {
            saved.title = req.body.title || req.saved.title;
            saved.description = req.body.description || req.saved.description;
            saved.category = req.body.title || req.saved.category;
            saved.save((err) => {
                //res.json({ message: 'Successfully edit' });
                req.flash('success', {
                    msg: 'Saved information has been updated'
                });
                res.redirect('/saved/' + req.params.id);
            });
        })
        }
    }