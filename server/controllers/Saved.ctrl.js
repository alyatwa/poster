const Saved = require('../models/Saved')
const agenda = require('../config/agenda')
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    addSaved: (req, res, next) => {
        saveSaved({
            isPublished: false,
            isScheduled: false,
            user: req.user.id,
            post: req.body.postid
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
     * get saved
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
            if (!saved) {
                res.status(404).send({
                    code: "INVALID_Saved",
                    msg: "Oh uh, Saved not found"
                })
            } else {
                if (saved.schedule) {
                    agenda.cancel({
                            _id: new ObjectId(saved.schedule)
                        },
                        (err, numRemoved) => {
                            console.log(err, numRemoved);
                            if (err) return res.status(500).send(err)

                        }).then(async job => {
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
                    });
                } else {
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


            }
        })
    },
    /**
     * cancel Schedule
     */
    cancelSchedule: (req, res, next) => {
        Saved.findById(req.params.id, (err, saved) => {
            if (!saved) {
                res.status(404).send({
                    code: "INVALID_Saved",
                    msg: "Oh uh, Saved not found"
                })
            } else if (saved.isScheduled) {
                console.log(saved.schedule);
                agenda.cancel({_id: new ObjectId(saved.schedule)},
                    (err, numRemoved) => {
                        console.log(err, numRemoved);
                        if (err) return res.status(500).send(err)
                        
                    }).then(async job => {
                        saved.isPublished = false
                        saved.isScheduled = false
                        saved.schedule = undefined
                        saved.save((err,saved) => {
                            console.log('schedule updated!');
                            res.status(200).send({
                            saved
                        })
                        })
                        
                        /*res.status(200).send({
                            code: "SCHEDULE_CANCELED",
                            msg: "scheduled saved post canceled!"
                        })
                        */
                    });
            } else {
                res.status(200).send({
                    code: "SCHEDULE_NOTSET",
                    msg: "saved post not scheduled!"
                })
            }
                })
    },
    /**
     * update Schedule Date
     */
    updateSchedule: (req, res, next) => {
        Saved.findById(req.params.id, (err, saved) => {
            if (!saved) {
                res.status(404).send({
                    code: "INVALID_Saved",
                    msg: "Oh uh, Saved not found"
                })
            } else {
                agenda.cancel({
                        _id: new ObjectId(saved.schedule)
                    },
                    (err, numRemoved) => {
                        console.log(err, numRemoved);
                        if (err) return res.status(500).send(err)

                    }).then(async job => {
                    saved.isPublished = false
                    saved.isScheduled = false
                    saved.schedule = undefined
                    saved.save((err, saved) => {
                        console.log('schedule updated!');
                        /*res.status(200).send({
                            saved
                        })*/
                        agenda.schedule(
                            new Date(req.body.date).toISOString(),
                            //new Date().toISOString(), // accepts Date or string
                            'schedule post', // the name of the task as defined in archive-ride.js
                            {
                                savedId: saved.id
                            }
                        ).then(async job => {
                            saved.isPublished = false
                            saved.isScheduled = true
                            saved.schedule = job.attrs._id
                            saved.save((err) => {
                                console.log('saved post rescheduled again!');
                                req.flash('success', {
                                    msg: 'Saved scheduled!'
                                });
                                res.redirect('/saved/' + req.params.id);
                            })
                        });
                    })
                });
            }
        })
    },
    /**
     * set Schedule date to post
     */
    setSchedule: (req, res, next) => {
        Saved.findById(req.params.id, (err, saved) => {
            if (!saved) {
                res.status(404).send({
                    code: "INVALID_Saved",
                    msg: "Oh uh, Saved not found"
                })
            } else {
                agenda.schedule(
                    new Date(req.body.date).toISOString(),
                    //new Date().toISOString(), // accepts Date or string
                    'schedule post', // the name of the task as defined in archive-ride.js
                    {
                        savedId: saved.id
                    }
                ).then(async job => {
                    saved.isPublished = false
                    saved.isScheduled = true
                    saved.schedule = job.attrs._id
                    saved.save((err) => {
                        console.log('schedule updated!');
                    })
                });
                req.flash('success', {
                    msg: 'Saved scheduled!'
                });
                res.redirect('/saved/' + req.params.id);
            }

            /*saved.save((err) => {
                //res.json({ message: 'Successfully edit' });
                
                res.redirect('/saved/' + req.params.id);
            });**/
        })
    }
    }