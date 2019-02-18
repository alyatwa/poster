const usercontroller = require('./../controllers/user.ctrl')

module.exports = function (router, passport) {
    // get a user
    router
        .get('/user/:id', isAuthenticated, usercontroller.getUser)
    // get a home
    router
        .route('/')
        .get((req, res) => {
            res.send('home');
        })

    // get a profile
    router
        .get('/profile', isAuthenticated, (req, res) => {
            //console.log('msgprof:', req.user.email,req.flash('loginMessage'));
                res.send(req.user);
            })
        .post('/profile', isAuthenticated, usercontroller.updateProfile)
        
    // adds a user
    router
        .get('/user/signup', (req, res) => {
            console.log('msg:', req.flash('signupMessage'));
            res.send('signup page ');
        })
        .post('/user/signup', passport.authenticate('signup', {
            successRedirect: '/profile', // redirect to the secure profile section
            failureRedirect: '/user/signup', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }))


    // login a user
    router
        .get('/user/login', (req, res) => {
            console.log('msglogin:',req.flash('loginMessage'));
            res.send(req.flash('loginMessage'));
        })
        .post('/user/login', passport.authenticate('login', {
            successRedirect: '/profile', // redirect to the secure profile section
            failureRedirect: '/user/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }))
    
    // verify password
    router
        .route('/verify/:token')
        .get((req, res) => {
            res.send('Verify page');
        })
        .post(usercontroller.verifyEmail)
    // reset password
    router
        .route('/reset/:token')
        .get((req, res) => {
            res.send('Reset page');
        })
        .post(usercontroller.resetUser)

    // forgot password
    router
        .route('/user/forgot_password')
        .get((req, res) => {
            res.send('Forgot page');
        })
        .post(usercontroller.forgotUser)

    // update password
    router
        .get('/user/change_password', isAuthenticated, (req, res) => {
            res.send('change password page');
        })
        .post('/user/change_password', isAuthenticated, usercontroller.changePassword)

    // Delete user account.
    router
        .get('/user/delete', isAuthenticated, (req, res) => {
            res.send('Delete User');
        })
        .post('/user/delete', isAuthenticated, usercontroller.deleteUser)

	// logout a user
	router
        .route('/user/logout')
        .get(usercontroller.logoutUser)

/*
    // add post schedule
    router
        .route('/user/saveschedule')
        .post(usercontroller.saveSchedule)
    // add invoice
    router
        .route('/user/saveinvoice')
        .post(usercontroller.saveInvoice)
    // save post "Saved"
    router
        .route('/user/savepost')
        .post(usercontroller.savePost)*/
        
    return router;
}
// route middleware to make sure
function isAuthenticated(req, res, next) {
    console.log(req.isAuthenticated());
    
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if isAuthenticated == false
    res.redirect('/');
}