const savedcontroller = require('./../controllers/saved.ctrl')

module.exports = function(router) {
    
    //get a saved
    router
        .route('/saved/:id')
        .get(isAuthenticated, savedcontroller.getSaved)
        .delete(isAuthenticated, savedcontroller.deleteSaved)
    //add saved
    router
        .route('/saved')
        .post(isAuthenticated, savedcontroller.addSaved)
    //set schedule
    router
        .route('/saved/schedule/:id')
        .put(isAuthenticated, savedcontroller.updateSchedule)
        .post(isAuthenticated, savedcontroller.setSchedule)
        .delete(isAuthenticated, savedcontroller.cancelSchedule)
    return router;
}
// route middleware to make sure 
function isAuthenticated(req, res, next) {
    console.log(req.isAuthenticated());

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if isAuthenticated == false
    res.status(404).send({
        code: "INVALID_LOGIGIN",
        msg: "You are not loggin!"
    })
    //res.redirect('/');
}