const plancontroller = require('./../controllers/plan.ctrl')

module.exports = (router) => {

    /**
     * get a plan
     */
    router
        .route('/plan/:id')
        .get(isAuthenticated, plancontroller.getPlan)
        .put(isAuthenticated, plancontroller.editPlan)
        .delete(isAuthenticated, plancontroller.deletePlan)

    /**
     * add a plan
     */
    router
        .route('/plan')
        .post(isAuthenticated, plancontroller.addPlan)

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