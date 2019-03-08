const subscriptioncontroller = require('./../controllers/subscription.ctrl')

module.exports = (router) => {

    /**
     * get a subscription
     */
    router
        .route('/subscription/:id')
        .get(isAuthenticated, subscriptioncontroller.getSubscription)

    /**
     * add a subscription
     */
    router
        .route('/subscription')
        .post(subscriptioncontroller.addSubscription)
        .put(subscriptioncontroller.cancelSubscription)
        .get(subscriptioncontroller.getSubscription)
    /**
     * Refund
     */
    router
        .route('/subscription/refund')
        .post(isAuthenticated, subscriptioncontroller.refundSubscription)
    /**
     * IPN Lisenter
     */
    router
        .route('/ipn')
        .post(subscriptioncontroller.IPN)

    return router;
}

// route middleware to make sure 
function isAuthenticated(req, res, next) {
    console.log(req.isAuthenticated());

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if isAuthenticated ==k false
    res.redirect('/');
}