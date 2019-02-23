const postcontroller = require('./../controllers/post.ctrl')

module.exports = function(router) {
    
    //increase post counter
    router
        .route('/post/counter/:id')
        .put(isAuthenticated, postcontroller.addUsedTimes)
    //get a post
    router
        .route('/post/:id')
        .get(isAuthenticated, postcontroller.getPost)
        .put(isAuthenticated, postcontroller.editPost)
        .delete(isAuthenticated, postcontroller.deletePost)
    //add post
    router
        .route('/post')
        .post( postcontroller.addPost)
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