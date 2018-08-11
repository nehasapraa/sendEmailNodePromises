const sendgrid = require("@sendgrid/client");
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_SENDER = process.env.SENDER;
const SENDGRID_SUBJECT = 'TEST EMAIL FROM SENDGRID';

sendgrid.setApiKey(SENDGRID_API_KEY);

function sendEmail(req, res) {
    var emailRecipients = [],
        emailRecipientsCC = [],
        emailRecipientsBCC = [],
        emails = req.body.email.split(","),
        emails_cc = req.body.email_cc.split(","),
        emails_bcc = req.body.email_bcc.split(",");

    emails.forEach(function (element) {
        emailRecipients.push({email: element})
    });
    emails_cc.forEach(function (element) {
        emailRecipientsCC.push({email: element})
    });
    emails_bcc.forEach(function (element) {
        emailRecipientsBCC.push({email: element})
    });

    const data = {
        content: [{type: "text/plain", value: 'Hello this is test email from SENDGRID.'}],
        from: {email: SENDGRID_SENDER},
        personalizations: [{
            subject: SENDGRID_SUBJECT,
            to: emailRecipients,
            cc: emailRecipientsCC,
            bcc: emailRecipientsBCC
        }],
        reply_to: {email: SENDGRID_SENDER, name: 'Neha'},
        subject: SENDGRID_SUBJECT
    };


    return new Promise((resolve, reject) => {

        const sgRequest = {body: data, method: "POST", url: "/v3/mail/send"};
        sendgrid
            .request(sgRequest)
            .then(([response, body]) => {
                console.log('service', response);
                resolve([response, body]);
            })
            .catch(err => {
                reject(`error sending ${JSON.stringify(err.response.body)}`);
            });
    });


}

module.exports = {sendEmail};