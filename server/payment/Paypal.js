var paypal = require('paypal-rest-sdk');
const axios = require('axios');
var clientId = 'AYUVCmrz4K3TACnFai3N8pqeU4RZ7dGPrzpkC8APwqPwsB70cDyjq42WuGQcBjfDyiFOKiNfWGoM1scw';
var secret = 'ECV5yQyApWGUA_DA3LwE7ZXEJj4FPuNP5y9xYBEMDd9SUfk0WX50y2ej8s4IogRsdJ9Gn3VcRkNGhgG9';

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': clientId,
    'client_secret': secret
});

module.exports = {
        getSubscription: (billingAgreementId) => {
            return new Promise((resolve, reject) => {
            paypal.billingAgreement.get(billingAgreementId, function (error, response) {
                if (error) {
                    console.log(error.response);
                    //throw error;
                    resolve(error);
                } else {
                    console.log(error.state);
                    resolve(response);
                }
            });})
        },
        cancelSubscription: (billingAgreementId) => {
            return new Promise((resolve, reject) => {
            paypal.billingAgreement.cancel(billingAgreementId, {
                        "note": "Canceling the agreement"
                    }, function (error, response) {
                if (error) {
                    console.log(error);
                    resolve(error);
                } else {
                    console.log("Cancel Billing Agreement Response");
                    resolve(response);
                }
            });})
        },
        getTxn: (saleId) => {
            return new Promise((resolve, reject) => {
            paypal.sale.get(saleId, function (error, sale) {
            if (error) {
                return resolve(error);
            } else {
                return resolve(JSON.stringify(sale));
            }

            });
            })
        },
        validate: (body) => {
             return new Promise((resolve, reject) => {
                 // Prepend 'cmd=_notify-validate' flag to the post string
                 let postreq = 'cmd=_notify-validate';
                 Object.keys(body).map((key) => {
                     postreq = `${postreq}&${key}=${body[key]}`;
                     return key;
                 });

                 const options = {
                     url: 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr',
                     method: 'post',
                     headers: {
                         'Content-Length': postreq.length,
                     },
                     encoding: 'utf-8',
                     data: postreq
                 };

                 // Make a post request to PayPal
                 axios(options)
                     .then(resBody => {
                         // Validate the response from PayPal and resolve / reject the promise.
                         console.log(resBody.data);
                         
                         if (resBody.data.substring(0, 8) === 'VERIFIED') {
                             resolve(true);
                         } else if (resBody.data.substring(0, 7) === 'INVALID') {
                             //reject(new Error('IPN Message is invalid.'));
                         } else {
                             //reject(new Error('Unexpected response body.'));
                         }
                     })
                     .catch(error => {
                         if (error || error.data.statusCode !== 200) {
                             reject(new Error(error));
                             return;
                         }
                     });
                 
             });
        },
        suspendSubscription: (billingAgreementId) => {
            return new Promise((resolve, reject) => {
            paypal.billingAgreement.suspend(billingAgreementId, {
                        "note": "Suspend the subscription"
                    }, function (error, response) {
                        if (error) {
                            //console.log(error);
                            //throw error;
                            resolve(false);
                        } else {
                            console.log("Suspend Billing Agreement Response");
                            console.log(response);
                            resolve(true);
                        }
        })})
        },
        reactivateSubscription: (billingAgreementId) => {
            return new Promise((resolve, reject) => {
            paypal.billingAgreement.reactivate(billingAgreementId, {
                        "note": "Reactivating the agreement"
                    }, function (error, response) {
                if (error) {
                    console.log(error);
                    resolve(false);
                } else {
                    console.log("Reactivate Billing Agreement Response");
                    console.log(response);
                    resolve(true);
                }
            });})
        },
        refund: (saleid, data) => {
            return new Promise((resolve, reject) => {
            paypal.sale.refund(saleid, data, function (error, refund) {
                if (error) {
                    //console.error(JSON.stringify(error));
                    return resolve(error)
                } else {
                    console.log("Refund Sale Response");
                    console.log(JSON.stringify(refund));
                    return resolve(refund);
                }
            });
        })
    }
}