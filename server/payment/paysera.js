var endpoints = require('./endpoints');
var PAYSERA_CLIENT_ID = process.env.PAYSERA_CLIENT_ID || 'f0ea04148a54268';


var paysera = exports;
var request = require('request');
var Q = require('q');
var fs = require('fs');
var urlParser = require('url');
var glob = require('glob');


/**
 * Send a request to paysera's API
 *
 * @param   {string}  operation - operation to perform; 'info' or 'upload'
 * @param   {mixed}   payload - image data
 * @returns {promise}
 */
paysera._payseraRequest = function (operation, payload, extraFormParams) {
        var deferred = Q.defer();
        var form = null;
        var options = {
            uri: null,
            method: null,
            encoding: 'utf8',
            json: true
        };
    switch (operation) {
        case 'getPayment':
            options.method = 'GET';
            options.uri = endpoints.WALLET + 'payment/' + payload;
            break;
        default:
            deferred.reject(new Error('Invalid operation'));
            return deferred.promise;
    }

/**
 * Get payment metadata by id
 * @param   {string}  id - unique payment id
 * @returns {promise}
 */
paysera.getPaymentbyID = function (id) {
    var deferred = Q.defer();

    if (!id) {
        deferred.reject('Invalid payment ID');
        return deferred.promise;
    }

    paysera._payseraRequest('getPayment', id)
        .then(function (json) {
            deferred.resolve(json);
        })
        .catch(function (err) {
            deferred.reject(err);
        });

    return deferred.promise;
}


    }