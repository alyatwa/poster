const savedcontroller = require('./../controllers/saved.ctrl')

module.exports = function(router, agenda) {
    
    //get a saved
    router
        .route('/saved/:id')
        .get(isAuthenticated, savedcontroller.getSaved)
        .put(isAuthenticated, savedcontroller.editSaved)
        .delete(isAuthenticated, savedcontroller.deleteSaved)
    //add saved
    router
        .route('/saved/add/:id')
        .post(isAuthenticated, savedcontroller.addSaved)
    //add schedule
    /*router
        .route('/saved/schedule/:id')
        .post(isAuthenticated, savedcontroller.addSaved)*/
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