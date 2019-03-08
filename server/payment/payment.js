var generate = require('../generate');
var endpoints = require('./endpoints');
var api = require('../api');

/**
 * Create, update and delete payment
 * @return {payment} payment functions
 */
function payment() {
    var baseURL = endpoints.WALLET + 'payment/';

    var ret = {
        baseURL: baseURL,
        create: function create(data, config, cb) {
            api.executeHttp('POST', this.baseURL, data, config, cb);
        },
        updateFreezeTime: function updateFreezeTime(paymentID, config, cb) {
            api.executeHttp('PUT', this.baseURL + paymentID+'/freeze', config, cb);
        },
        get: function get(paymentID, config, cb) {
            api.executeHttp('GET', this.baseURL + paymentID, config, cb);
        },
        cancel: function cancel(paymentID, config, cb) {
            api.executeHttp('DELETE', this.baseURL + paymentID, config, cb);
        },
        finalizePayment: function finalizePayment(paymentID, config, cb) {
            api.executeHttp('PUT', this.baseURL + paymentID + '/finalize', config, cb);
        },
        setPassword: function setPassword(paymentID, config, cb) {
            api.executeHttp('PUT', this.baseURL + paymentID + '/password', config, cb);
        },
        searchPayments: function searchPayments(status, wallet, beneficiary, config, cb) {
            api.executeHttp('GET', endpoints.WALLET + `payments/id?status=${status}&wallet=${wallet}&beneficiary=${beneficiary}`, config, cb);
        }
    };
    //ret = generate.mixin(ret, operations);
    return ret;
}

module.exports = payment;