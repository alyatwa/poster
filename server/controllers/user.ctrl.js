const User = require('./../models/User')
var async = require('async')
var crypto = require('crypto')
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid')


const smtpTransport = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: "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"
    })
);

module.exports = {
    /*signupUser: (req, res, next) => {
        passport.authenticate('signup', {
            successRedirect: '/profile', // redirect to the secure profile section
            failureRedirect: '/signup', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        })
    },*/
    dashboard: (req, res, next) => {
        
    },
    getUser: (req, res, next) => {
        User.findById(req.params.id).then((err, user) => {
            if (err)
                res.send(err)
            else if (!user)
                res.send(404)
            else
                res.send(user)
            next()
        })
    },
    forgotUser: (req, res, next) => {
        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                User.findOne({
                    email: req.body.email
                }, function (err, user) {
                    if (!user) {
                        console.log('error', 'No account with that email address exists.');
                        req.flash('error', 'No account with that email address exists.');
                        return res.redirect('/forgot');
                    }

                    user.passwordResetToken = token;
                    user.passwordResetExpires = Date.now() + 3600000; // 1 hour

                    user.save(function (err) {
                        done(err, token, user);
                    });
                });
            },
            function (token, user, done) {
                console.log(token);
                
                var mailOptions = {
                    to: user.email,
                    from: 'ali@gmail.com',
                    subject: 'Node.js Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                    console.log('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                    done(err, 'done');
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/forgot');
        });
    },
    resetUser: (req, res, next) => {
          async.waterfall([
              function (done) {
                  User.findOne({
                      passwordResetToken: req.params.token,
                      passwordResetExpires: {
                          $gt: Date.now()
                      }
                  }, function (err, user) {
                      console.log(req.body.password, req.params.token);
                      
                      if (!user) {
                          req.flash('error', 'Password reset token is invalid or has expired.');
                          return res.redirect('back');
                      }

                      user.password = user.generateHash(req.body.password);
                      user.passwordResetToken = undefined;
                      user.passwordResetExpires = undefined;

                      user.save(function (err) {
                          console.log('pass saved');
                          
                          done(err, user);
                      });
                  });
              },
              function (user, done) {
                  var mailOptions = {
                      to: user.email,
                      from: 'poster@gmail.com',
                      subject: 'Your password has been changed',
                      text: 'Hello,\n\n' +
                          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                  };
                  smtpTransport.sendMail(mailOptions, function (err) {
                      console.log('Success! Your password has been changed.');
                      req.flash('success', 'Success! Your password has been changed.');
                      done(err);
                  });
              }
          ], function (err) {
              res.redirect('/');
          });
    },
    verifyEmail: (req, res, next) => {
          async.waterfall([
              function (done) {
                  User.findOne({
                      emailVerifyToken: req.params.token
                  }, function (err, user) {
                      console.log(req.params.token);
                      
                      if (!user) {
                          req.flash('error', 'verification token is invalid or has expired.');
                          return res.redirect('back');
                      }
                      user.emailVerifyToken = undefined;
                      user.verified = true;

                      user.save(function (err) {
                          console.log('Email verified!');
                          
                          done(err, user);
                      });
                  });
              }
          ], function (err) {
              res.redirect('/');
          });
    },
    logoutUser: (req, res, callback) => {
        req.logout()
        req.flash('success_msg', 'You are logged out')
        res.redirect('/')
    },
    deleteUser: (req, res, callback) => {
        User.deleteOne({
            _id: req.user.id
        }, (err) => {
            if (err) {
                //return next(err);
            }
            console.log('user deleted!');
            
            req.logout();
            req.flash('info', {
                msg: 'Your account has been deleted.'
            });
            res.redirect('/');
        });
    },
    changePassword: (req, res, callback) => {
       User.findById(req.user.id, (err, user) => {
           if (err) {
               //return next(err); 
           }
           user.password = user.generateHash(req.body.password);
           user.save((err) => {
               if (err) {
                   //return next(err);
               }
               req.flash('success', {
                   msg: 'Password has been changed.'
               });
               console.log('Password has been changed.');
               
               res.redirect('/profile');
           });
       });
    },
    updateProfile: (req, res, callback) => {
       User.findById(req.user.id, (err, user) => {
           if (err) {
               return next(err);
           }
           user.email = req.body.email || req.user.email;
           user.profile.name = req.body.name || req.user.profile.name;
           user.profile.location = req.body.location || req.user.profile.location;
           user.profile.picture = req.body.picture || req.user.profile.picture;
           user.profile.website = req.body.website || req.user.profile.website;
           user.save((err) => {
               if (err) {
                   if (err.code === 11000) {
                       req.flash('errors', {
                           msg: 'The email address you have entered is already associated with an account.'
                       });
                       return res.redirect('/account');
                   }
                   return next(err);
               }
               req.flash('success', {
                   msg: 'Profile information has been updated.'
               });
               res.redirect('/profile');
           });
       });
    },
    /**
     * save post to Saved
     */
    savePost: (req, res, next) => {
        User.findById(req.body.id).then((user) => {
            return user.savePost(req.body.post_id).then(() => {
                return res.json({
                    msg: "Saved"
                })
            })
        }).catch(next)
    },
    saveSchedule: (req, res, next) => {
        User.findById(req.body.id).then((user) => {
            return user.addSchedule(req.body.post_id).then(() => {
                return res.json({
                    msg: "Saved"
                })
            })
        }).catch(next)
    },
    saveInvoice: (req, res, next) => {
        User.findById(req.body.id).then((user) => {
            return user.addInvoice(req.body.post_id).then(() => {
                return res.json({
                    msg: "Saved"
                })
            })
        }).catch(next)
    }
    /*getUserProfile: (req, res, next) => { 
        User.findById(req.params.id).then((_user) => {
            return User.find({
                'following': req.params.id
            }).then((_users) => {
                _users.forEach((user_) => {
                    _user.addFollower(user_)
                })
                return Post.find({
                    'user': req.params.id
                }).then((_posts) => {
                    return res.json({
                        user: _user,
                        posts: _posts
                    })
                })
            })
        }).catch((err) => console.log(err))
    }*/
}