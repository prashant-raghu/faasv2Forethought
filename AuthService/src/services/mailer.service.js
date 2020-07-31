const pug = require('pug');
const path = require('path');
const config = require('../environments/index');
const nodemailer = require('nodemailer');

exports.verification = (name, email, token) => {
    const html = pug.renderFile(path.join(__dirname, '../views/verification/index.pug'), {
        name: name,
        link: config.server.url + '/api/user/verifyEmail/?token=' + token
    });
    sendMail(email, 'Welcome to IWH! Confirm Your Email', html)
        .then(console.log)
        .catch(console.error);
};

exports.forgotPassword = (name, email, token) => {
    const html = pug.renderFile(path.join(__dirname, '../views/emailForgotPassword.pug'), {
        name: name?name:'User',
        email: email,
        link: config.server.url + '/user/resetPassword/' + token
    });
    sendMail(email, 'Forgot Password', html)
        .then(console.log)
        .catch(console.error);
};

// helper functions

const transporter = nodemailer.createTransport({
    service: 'SendGrid', // no need to set host or port etc.
    auth: {
        user: config.smtp.sendgrid.user,
        pass: config.smtp.sendgrid.pass
    }
});

function sendMail(to, subject, html) {
    let message = {
        from: config.smtp.sendgrid.email,
        to: to,
        subject: subject,
        html: html
    };
    return transporter.sendMail(message);
}
