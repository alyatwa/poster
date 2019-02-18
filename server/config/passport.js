var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid')
var async = require('async')
var crypto = require('crypto')
const smtpTransport = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: "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"
    })
);

// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({
                'email': email
            }, function (err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(null, false, req.flash('signupMessage', err));

                // check to see if theres already a user with that email
                if (user) {
                    //return done(null, false, {message: 'That email is already taken.'});
                    console.log('That email is already taken.');
                    
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
                } else {
                    async.waterfall([
                                function (done) {
                                    crypto.randomBytes(20, function (err, buf) {
                                        var token = buf.toString('hex');
                                        done(err, token);
                                    });
                                },
                                function (token, done) {
                                    // if there is no user with that email
                                    // create the user
                                    var newUser = new User();
                                    //console.log('### ', email, password);
                                    // set the user's local credentials
                                    newUser.email = email;
                                    newUser.password = newUser.generateHash(password); // use the generateHash function in our user model
                                    newUser.role = 'customer';
                                    newUser.verified = false;
                                    newUser.emailVerifyToken = token;
                                    newUser.profile.name = req.body.name;
                                    // save the user
                                    newUser.save(function (err) {
                                        if (err)
                                            throw err;

                                        console.log('User signup success!');
                                        return done(err, token, newUser);
                                        //return done(null, newUser, req.flash('signupMessage', 'You have registered, Now please login'));
                                    });
                                },
                                function (token, user, done) {
                                    //console.log(token);

                                    var mailOptions = {
                                        to: user.email,
                                        from: 'ali@gmail.com',
                                        subject: 'Verfiy Email Poster',
                                        text: 'You are receiving to verify your email \n\n' +
                                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                            'http://' + req.headers.host + '/verify/' + token + '\n\n' 
                                    };
                                    smtpTransport.sendMail(mailOptions, function (err) {
                                        req.flash('info', 'An e-mail has been sent to ' + user.email + ' to verify email');
                                        console.log('info', 'An e-mail has been sent to ' + user.email + ' to verify email');
                                        return done(null, user, req.flash('signupMessage', 'You have registered, Now please login'));
                                    });
                                }
                            
                            ])
                }

            });

        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({
                'email': email
            }, function (err, user) {

                if (!user)
                    console.log('no user found');
                
                // if there are any errors, return the error before anything else
                if (err)
                    return done(null, false, req.flash('loginMessage', err));
                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user, req.flash('loginMessage', 'You have successfully logged in!!'));
            });

        }));

};