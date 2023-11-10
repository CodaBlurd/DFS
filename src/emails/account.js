
const nodemailer = require('nodemailer');
const { catchAsync } = require('../helper/catchPromiseRejection');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',  // Replace with your SMTP host
  port: 587,  // SMTP port (587 for unencrypted/TLS, 465 for SSL)
  secure: false,  // true for 465, false for other ports
  auth: {
    user: 'your_email@example.com',  // Replace with your SMTP email
    pass: 'your_password'  // Replace with your SMTP password
  }
});

// Send email function
const sendEmail = catchAsync(async function ({ from, to, subject, text }) {
    try {
      let info = await transporter.sendMail({
        from: from,  // Sender address
        to: to,  // List of receivers
        subject: subject,  // Subject line
        text: text,  // Plain text body
        // html: "<b>Hello world?</b>",  // HTML body (optional)
      });
  
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  })

module.exports = sendEmail;


































// const sgMail = require('@sendgrid/mail')


















// const { catchAsync } = require('../helper/catchPromiseRejection')
// const config = require('../../config/configuration');

// sgMail.setApiKey(config.sendgridApiKey);

// exports.sendWelcomeEmail = catchAsync(async(email, name)=> {
//     await sgMail.send({
//         from: 'uduak_09@icloud.com',
//         to: email,
//         subject: 'Thanks for signing up!',
//         text: `Welcome to DFS website ${name}, we hope you enjoy your experience`
//     });
//     console.log('Welcome email sent successfully');
// });


// exports.sendCancelationEmail = catchAsync(async (email, name)=>{
//     await sgMail.send({
//         from: 'uduak_09@icloud.com',
//         to: email,
//         subject: `We are sorry to see you go ${name}`,
//         text: `Your account has been successfully canceled
//         ${name}, We hope to have you back soon`
//     })
// });

// exports.sendBidAcceptanceEmail = catchAsync( async (name, email)=>{
//     await sgMail.send({
//         from: 'uduak_09@icloud.com',
//         to: email,
//         subject: `Your bid has been accepted! ${name}`,
//         text: `Congrats! ${name} The client has accepted your bid`
//     })
// })
