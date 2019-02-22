const sourcecontroller = require('./../controllers/source.ctrl')

module.exports = function(router) {
    
    //get a source
    router
        .route('/source/:id')
        .get(isAuthenticated, sourcecontroller.getSource)
        .put(isAuthenticated, sourcecontroller.editSource)
        .delete(isAuthenticated, sourcecontroller.deleteSource)
    //add source
    router
        .route('/source')
        .post(isAuthenticated, sourcecontroller.addSource)
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