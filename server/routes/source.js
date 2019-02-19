const sourcecontroller = require('../controllers/source.ctrl')

module.exports = function(router) {
    
    //get a source
    router
        .route('/source/:id')
        .get(isAuthenticated, sourcecontroller.getPost)
        .put(isAuthenticated, sourcecontroller.editPost)
        .delete(isAuthenticated, sourcecontroller.deletePost)
    //add source
    router
        .route('/source')
        .source(isAuthenticated, sourcecontroller.addPost)
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