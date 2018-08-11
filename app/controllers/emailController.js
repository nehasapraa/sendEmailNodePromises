/**
 * Email Controlller
 */
var path = require('path');
var SendgridService = require(path.join(__dirname, '../', "services/SendgridService"));
var MailgunService = require(path.join(__dirname, '../', "services/MailgunService"));


function sendEmail(req, res) {

    SendgridService.sendEmail(req, res)
        .then(([response, body]) => {
            res.render('index', {
                sent: true,
                provider: 'SENDGRID',
                response: response
            });
        })
        //catch errors master provider throws, and default to slave provider
        .catch(err => {
            console.log('err', err);
            MailgunService.sendEmail(req, res)
                .then(msg => {
                    res.render('index', {
                        sent: true,
                        provider: 'MAILGUN',
                        response: msg
                    });
                })
                .catch(err => {
                    reject(`error sending ${JSON.stringify(err.response.body)}`);
                });
        });
}

module.exports = {sendEmail};