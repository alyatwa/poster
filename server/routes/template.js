const templatecontroller = require('./../controllers/template.ctrl')

module.exports = (router) => {

    /**
     * get a template
     */
    router
        .route('/template/:id')
        .get(templatecontroller.getTemplate)

    /**
     * add a template
     */
    router
        .route('/template')
        .template(templatecontroller.addTemplate)
}