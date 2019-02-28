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

    /**
     * del template
     */
    deleteTemplate: (req, res, next) => {
        Template.deleteOne({
            _id: req.params.id
        }, (err) => {
            if (err) {
                //return next(err);
            }
            console.log('template deleted!');
            req.flash('info', {
                msg: 'Template has been deleted.'
            });
            res.redirect('/dashboard');
        });
    },

    /**
     * edit template
     */

    editTemplate: (req, res, next) => {
        Template.findOneAndUpdate({
            _id: req.params.id
        },{$set:{dimensions:720,img:'00'}}, (err, template) => {
            if (err) {
                //return next(err);
            }
            res.send(template);
        });
    },

    /**
     * get template
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