const Subscription = require('../models/Subscription')
const Paypal = require('../payment/Paypal')
const User = require('./../models/User')

var self = module.exports = {
    addSubscription: (req, res, next) => {
        let {
            startTime,
            endTime,
            plan,
            user
        } = req.body
 
        saveSubscription({
                startTime,
                endTime,
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
                    User.findOneAndUpdate({
                        _id: user
                    }, {
                        $set: {
                            subscription: subscription._id
                        }
                    }, {
                        new: true
                    }, (err, doc) => {
                        if (err) {
                            console.log("Something wrong when updating data!");
                        }
                        console.log(doc);
                    });
                res.send(subscription)
                    
                }
                next()
            })
        }
    },

    /**
     * XXX
     * reactivate subscription by user id
     */
    reactivateSubscription:  (req, res, next) => {
        Subscription.findOne({
                    user: req.body.userID
                },async (err, subscription) => {
        var billingAgreementId = subscription.paypal.profileID;
        var reactivate = await Paypal.reactivateSubscription(billingAgreementId);
        if (reactivate) {
            self.updateSubscription('reactive', req.body.userID)
            res.send({
            msg: 'Subscription reactived!'
        });}
    })
    },
    /**
     * XXXX
     * suspend subscription by user id
     */
    suspendSubscription: async (req, res, next) => {
        Subscription.findOne({
            user: req.body.userID
        }, async (err, subscription) => {
            var billingAgreementId = subscription.paypal.profileID;
            var suspended = await Paypal.suspendSubscription(billingAgreementId);
            if (suspended) {
                res.send({
                msg: 'Subscription suspended!'
            });}
        })
    },
    /**
     * cancel subscription by user id
     */
    cancelSubscription: async (req, res, next) => {
        Subscription.findOne({
            user: req.body.userID
        }, async (err, subscription) => {
            var billingAgreementId = subscription.paypal.profileID;
            var cancel = await Paypal.cancelSubscription(billingAgreementId);
            if (cancel.httpStatusCode === 204) {
                res.send({
                msg: 'Subscription canceled!'
            });
            } else {
                res.send(cancel);
            }
        })
    },

    refundSubscription: async (req, res, next) => {
        var saleid = req.body.saleid;
        var amount = req.body.amount;
        var userID = req.body.userID;
        var data = {
                amount: {
                    total: amount.toString(),
                    currency: 'USD'
                }
            }
        var refund = await Paypal.refund(saleid, data)
        res.send(refund)
    },
    isSubscriptionActive: (userID) => {
        Subscription.findOne({
            _id: userID
        }, function (err, subsc) {
            console.log(subsc);
            if (['cancel', 'suspended','refund', 'failed', 'expired'].includes(subsc.subscriptionStatus)) {
                return false;
            } else if (['active', 'subscriped'].includes(subsc.subscriptionStatus)) {
                return true;
            }
        });
    },
    updateSubscription: (subscriptionStatus, userID, ipnJSON) => {
        var update = {
            "$set": {}
        }
        if (ipnJSON && ipnJSON.txn_type) update["$set"]["paypal." + ipnJSON.txn_type] = ipnJSON
        if (ipnJSON && ipnJSON.reason_code) update["$set"]["paypal." + ipnJSON.reason_code] = ipnJSON
        if (ipnJSON && ipnJSON.txn_type === 'subscr_payment') {
            update["$set"]["paypal.last_txn_id"] = ipnJSON.txn_id
            update["$set"]["paypal.profileID"] = ipnJSON.subscr_id
        }
        update["$set"]["subscriptionStatus"] = subscriptionStatus
        Subscription.findOneAndUpdate({
                    user: '5c6ae749ada0c602a451cc54'
                }, update, {
            new: true,
            multi: true,
            strict: false
        }, (err, subsc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            console.log(subsc);
        });
    },
    /**
     * IPN events
     */
    IPN: async (req, res, next) => {
        const body = req.body;
        /*const isValidated = await Paypal.validate(body);
        if (!isValidated) {
            console.error('Error validating IPN message.');
            //return;
        }
        console.log('isValidated:  ', isValidated);*/
        console.log(body);
        if (body.reason_code) self.updateSubscription('refund', body.custom, body);
        const transactionType = body.txn_type;
        switch (transactionType) {
            case 'web_accept':
            case 'subscr_payment':
                self.updateSubscription('active', body.custom, body);
                break;
            case 'subscr_signup': //Subscription started
                self.updateSubscription('active', body.custom, body);
                break;
            case 'subscr_cancel':
                self.updateSubscription('cancel', body.custom, body);
                break;
            case 'subscr_eot': //Subscription expired
                self.updateSubscription('expired', body.custom, body);
                break;
            case 'recurring_payment_suspended':
                self.updateSubscription('suspended', body.custom, body);
                break;
            case 'recurring_payment_expired':
                self.updateSubscription('expired', body.custom, body);
                break;
            case 'recurring_payment':
                self.updateSubscription('active', body.custom, body);
                break;
            case 'recurring_payment_failed':
                self.updateSubscription('failed', body.custom, body);
                break;
            case 'recurring_payment_suspended_due_to_max_failed_payment':
                // Contact the user for more details
                self.updateSubscription('suspended', body.custom, body);
                break;
            default:
                console.log('Unhandled transaction type: ', transactionType);
        };
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
        Subscription.findOne({user: req.body.userID}, (err, subscription) => {
                if (err)
                    res.send(err)
                else
                    res.send(subscription)
            })
    }
}