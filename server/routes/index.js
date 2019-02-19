const user = require('./user')
const post = require('./post')
const source = require('./source')

module.exports = (router, passport) => {
    //console.log('index****************', passport);
    router.use('/user', user(router, passport));
    router.use('/post', post(router));
    router.use('/source', source(router));
    return router;
}
