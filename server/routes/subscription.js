const subscriptioncontroller = require('./../controllers/subscription.ctrl')

module.exports = (router) => {

    /**
     * get a subscription
     */
    router
        .route('/subscription/:id')
        .get(isAuthenticated, subscriptioncontroller.getSubscription)
        .put(isAuthenticated, subscriptioncontroller.editSubscription)
        .delete(isAuthenticated, subscriptioncontroller.deleteSubscription)

    /**
     * add a subscription
     */
    router
        .route('/subscription')
        .post(isAuthenticated, subscriptioncontroller.addSubscription)

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