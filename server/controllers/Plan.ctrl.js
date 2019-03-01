/** */
const Plan = require('../models/Plan')

module.exports = {
    addPlan: (req, res, next) => {
        let {
            name,
            description,
            price,
            credits
        } = req.body
 
        savePlan({
                name,
                description,
                price,
                credits
            })

        function savePlan(obj) {
            new Plan(obj).save((err, plan) => {
                if (err)
                    res.send(err)
                else if (!plan)
                    res.send(400)
                else {
                    return res.send(plan)
                    
                }
                next()
            })
        }
    },

    /**
     * del plan
     */
    deletePlan: (req, res, next) => {
        Plan.deleteOne({
            _id: req.params.id
        }, (err) => {
            if (err) {
                //return next(err);
            }
            console.log('plan deleted!');
            req.flash('info', {
                msg: 'Plan has been deleted.'
            });
            res.redirect('/dashboard');
        });
    },

    /**
     * edit plan
     */

    editPlan: (req, res, next) => {
        let {
            name,
            description,
            price,
            credits
        } = req.body
        Plan.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                name,
                description,
                price,
                credits
            }
        }, (err, plan) => {
            if (err) {
                //return next(err);
            }
            res.send(plan);
        });
    },

    /**
     * get plan
     */
    getPlan: (req, res, next) => {
        Plan.findById(req.params.id).exec((err, plan) => {
                if (err)
                    res.send(err)
                else if (!plan)
                    res.send(404)
                else
                    res.send(plan)
                next()
            })
    }
}