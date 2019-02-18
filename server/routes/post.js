const postcontroller = require('./../controllers/post.ctrl')

module.exports = function(router) {
    /**
     * get a post
     */
    router
        .get('/post/:id',postcontroller.getPost)

    /**
     * add a post
     */
    router
        .post('/post',postcontroller.addPost)
        
    return router;
}
