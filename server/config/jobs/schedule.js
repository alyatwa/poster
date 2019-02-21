const Saved = require('./../../models/Saved')

module.exports = function (agenda) {
    agenda.define('schedule post', (job, done) => {
        // publish post on facebook / insta / twitter
        console.log('###Now: ',job.attrs);
        Saved.findById(job.attrs.data.savedId, (err, saved) => {
            //console.log(job.attrs.data.savedId);
            saved.isPublished = true;
            saved.isScheduled = false;
            saved.schedule = undefined;
            saved.save((err) => {
                console.log('saved post published');
            })
        })
        job.remove(err => {
            if (!err) {
                console.log('Successfully removed job from collection');
            }
        });
        /*Saved.findById(req.params.id, (err, saved) => {
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
                    },
                );
            }
        })*/
        /*User.get(job.attrs.data.userId, (err, user) => {
            if (err) {
                return done(err);
            }
            email(user.email(), 'Thanks for registering', 'Thanks for registering ' + user.name(), done);
        });*/
    });
};