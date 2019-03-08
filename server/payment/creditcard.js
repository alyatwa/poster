var generate = require('../generate');
var endpoints = require('./endpoints');
var api = require('../api');

/**
 * Create, update and delete creditcard
 * @return {creditCard} creditCard functions
 */
function creditCard() {
    var baseURL = endpoints.WALLET + 'card/';

    var ret = {
        baseURL: baseURL,
        create: function create(data, config, cb) {
            api.executeHttp('POST', this.baseURL, data, config, cb);
        },
        update: function update(cardID, config, cb) {
            api.executeHttp('PUT', this.baseURL + cardID, config, cb);
        },
        get: function get(cardID, config, cb) {
            api.executeHttp('GET', this.baseURL + cardID, config, cb);
        },
        delete: function delete(cardID, config, cb) {
            api.executeHttp('PUT', this.baseURL + cardID, config, cb);
        },
        listCards: function listCards(user_id,limit,offset, config, cb) {
            api.executeHttp('GET', endpoints.WALLET +`cards?user_id=${user_id}&limit=${limit}&offset=${offset}`, data, config, cb);
        }
    };
    //ret = generate.mixin(ret, operations);
    return ret;
}

module.exports = creditCard;