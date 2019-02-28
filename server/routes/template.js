const templatecontroller = require('./../controllers/template.ctrl')

module.exports = (router) => {

    /**
     * get a template
     */
    router
        .route('/template/:id')
        .get(isAuthenticated, templatecontroller.getTemplate)
        .put(isAuthenticated, templatecontroller.editTemplate)
        .delete(isAuthenticated, templatecontroller.deleteTemplate)

    /**
     * add a template
     */
    router
        .route('/template')
        .post(isAuthenticated, templatecontroller.addTemplate)

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