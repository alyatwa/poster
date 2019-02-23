const Source = require('../models/Source')
const Twitter = require('../platform/Twitter')
const Instagram = require('../platform/Instagram')
const Tumblr = require('../platform/Tumblr')
const Reddit = require('../platform/Reddit')

module.exports = {
    addSource: async  (req, res, next) => {
        //let slug = req.body.url.match('((https?://)?(www\.)?twitter\.com/)?(@|#!/)?([A-Za-z0-9_]{1,15})(/([-a-z]{1,20}))?')[5];
        var profile, slug, url = req.body.url;
        var platform = new URL(url).host.split('.').reverse()[1];
        if (platform === 'tumblr') {
            slug = url.split('.')[0].split('//')[1]
        } else if (platform === 'reddit') {
            slug = url.split('/')[4]
        }
        else {
            slug = url.split('/')[3]
        }
        console.log(slug,' ', platform);

        if (platform === 'twitter') {
            profile = await Twitter.getUser(req.body)
        } else if (platform === 'instagram') {
            profile = await Instagram.getUser(req.body)
            if (profile.code) {
                res.send(profile)
                return;
            }
        } else if (platform === 'tumblr') {
            profile = await Tumblr.getUser(req.body)
            res.send(profile)
        } else if (platform === 'reddit') {
            profile = await Reddit.getUser(req.body)
            if (profile.code) {
                res.send(profile)
                return;
            }
            //res.send(profile)
        } else {
            console.log(platform);
            res.json({
                code: 'PLATFORM_INVALID',
                msg: 'no platform found!'
            })
        }
        Source.findOneAndUpdate({
            'slug': slug,
            'platform': platform
        }, profile, {
            upsert: true,
            new: true
        },
          function (err, source) {
              res.send(source)
        })
    },
    /**
     * source_id
     */
    getSource: (req, res, next) => {
        Source.findById(req.params.id).exec((err, source) => {
                if (err)
                    res.send(err)
                else if (!source)
                    res.status(404).send({
                        code: "INVALID_SOURCE",
                        msg: "Oh uh, Source not found"
                    })
                else
                    res.send(source)
                next()
            })
    },
    /**
     * delete Source
     */
    deleteSource: (req, res, next) => {
        Source.deleteOne({
            _id: req.params.id
        }, (err) => {
            if (err) {
                //return next(err);
            }
            console.log('source deleted!');
            req.flash('info', {
                msg: 'Your Source has been deleted.'
            });
            res.redirect('/dashboard');
        });
        }
    }
     /*function getUser(data) {
         var profile, slug, url = data.url;
         var platform = new URL(url).host.split('.').reverse()[1];
         if (platform === 'tumblr') {
             slug = url.split('.')[0].split('//')[1]
         } else if (platform === 'reddit') {
             slug = url.split('/')[4]
         } else {
             slug = url.split('/')[3]
         }
         
        return new Promise(resolve => {
            Source.findOne({ // test return 
                     'slug': slug,
                     'platform': platform
                 },  function (err, checksource) {
                         if (checksource) {
                             profile = {
                                 code: 'SOURCE_INVALID',
                                 msg: 'source already added!'
                             }
                         }})
            if (platform === 'twitter') {
                profile = Twitter.getUser(data)
            } else if (platform === 'instagram') {
                profile = Instagram.getUser(data)
            } else if (platform === 'tumblr') {
                profile = Tumblr.getUser(data)
            } else if (platform === 'reddit') {
                profile = Reddit.getUser(data)
            } else {
                profile={
                    code: 'PLATFORM_INVALID',
                    msg: 'no platform found!'
                }
            }
            resolve(profile)
        })
     }*/