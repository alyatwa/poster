/** */
const Template = require('../models/Template')

module.exports = {
    addTemplate: (req, res, next) => {
        let {
            dimensions,
            img
        } = req.body
 
        saveTemplate({
                dimensions,
                img
            })

        function saveTemplate(obj) {
            new Template(obj).save((err, template) => {
                if (err)
                    res.send(err)
                else if (!template)
                    res.send(400)
                else {
                    return res.send(template)
                    
                }
                next()
            })
        }
    },
    /*getAll: (req, res, next) => {
        Template.find(req.params.id)
            .populate('author').exec((err, template) => {
                if (err)
                    res.send(err)
                else if (!template)
                    res.send(404)
                else
                    res.send(template)
                next()
            })
    },*/


    /**
     * template_id
     */
    getTemplate: (req, res, next) => {
        Template.findById(req.params.id).exec((err, template) => {
                if (err)
                    res.send(err)
                else if (!template)
                    res.send(404)
                else
                    res.send(template)
                next()
            })
    }
}