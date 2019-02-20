const user = require('./user')
const post = require('./post')
const source = require('./source')
const saved = require('./saved')

module.exports = (router, passport) => {
    router.use('/user', user(router, passport));
    router.use('/post', post(router));
    router.use('/source', source(router));
    router.use('/saved', saved(router));
    return router;
}
