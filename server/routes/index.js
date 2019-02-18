const user = require('./user')
const post = require('./post')

module.exports = (router, passport) => {
    //console.log('index****************', passport);
    router.use('/user', user(router, passport));
    router.use('/post', post(router));
    return router;
}
