var mailgun = require('mailgun.js');

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_TEST_DOMAIN = process.env.MAILGUN_TEST_DOMAIN;
const MAILGUN_SENDER = process.env.SENDER;
var MailgunService = mailgun.client({'username': 'api', 'key': MAILGUN_API_KEY});

function sendEmail(req, res) {
    var emails = req.body.email.split(",");
    var emails_cc = req.body.email_cc.split(",");
    var emails_bcc = req.body.email_bcc.split(",");
    var options = {
        from: MAILGUN_SENDER,
        to: emails,
        cc: emails_cc,
        bcc: emails_bcc,
        subject: 'TEST EMAIL FROM MAILGUN',
        text: 'Hello this is test email from MAILGUN.',

    };

    return new Promise((resolve, reject) => {
        MailgunService.messages.create(MAILGUN_TEST_DOMAIN, options)
            .then(msg => {
                resolve(msg);
            })
            .catch(err => {
                reject(`error sending ${err.message}`);
                res.render('error', {
                    message: err.message,
                    status: err.status,
                });

            });
    });


}

module.exports = {sendEmail};