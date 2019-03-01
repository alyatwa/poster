/** */
const Subscription = require('../models/Subscription')

module.exports = {
    addSubscription: (req, res, next) => {
        let {
            startTime,
            credits,
            endTime,
            renewed,
            plan,
            user
        } = req.body
 
        saveSubscription({
                startTime,
                credits,
                endTime,
                renewed,
                plan,
                user
            })

        function saveSubscription(obj) {
            new Subscription(obj).save((err, subscription) => {
                if (err)
                    res.send(err)
                else if (!subscription)
                    res.send(400)
                else {
                    return res.send(subscription)
                    
                }
                next()
            })
        }
    },

    /**
     * del subscription
     */
    deleteSubscription: (req, res, next) => {
        Subscription.deleteOne({
            _id: req.params.id
        }, (err) => {
            if (err) {
                //return next(err);
            }
            console.log('subscription deleted!');
            req.flash('info', {
                msg: 'Subscription has been deleted.'
            });
            res.redirect('/dashboard');
        });
    },

    /**
     * edit subscription
     */

    editSubscription: (req, res, next) => {
        let {
            startTime,
            credits,
            endTime,
            renewed,
            plan,
            user
        } = req.body
        Subscription.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                startTime,
                credits,
                endTime,
                renewed,
                plan,
                user
            }
        }, (err, subscription) => {
            if (err) {
                //return next(err);
            }
            res.send(subscription);
        });
    },

    /**
     * get subscription
     */
    getSubscription: (req, res, next) => {
        Subscription.findById(req.params.id).exec((err, subscription) => {
                if (err)
                    res.send(err)
                else if (!subscription)
                    res.send(404)
                else
                    res.send(subscription)
                next()
            })
    }
}