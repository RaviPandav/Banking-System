const nodemailer = require('nodemailer');

//  create transporter (SMTP server => email handel karva mate email comunict kare)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is alrady to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Banking-system" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// create send Registration email
const sendRegistrationEmail = async (userEmail, name) => {
  const subject = 'Welcome to Our Banking System!';
  const text = `Dear ${name},\n\nThank you for registering with our banking system. We are excited to have you on board!\n\nBest regards,\nYour Banking Team`;
  const html = `<p>Dear ${name},</p><p>Thank you for registering with our banking system. We are excited to have you on board!</p><p>Best regards,<br>Your Banking Team</p>`;

  await sendEmail(userEmail, subject, text, html);

} 

// crate send Transaction Eamil
const sendTransactionEamil = async (userEmail, name, amount, toAccount) => {
  const subject = 'Transaction Notification';
  const text = `Dear ${name},\n\nA transaction of ${amount} has been made to account ${toAccount}.\n\nBest regards,\nYour Banking Team`;
  const html = `<p>Dear ${name},</p><p>A transaction of ${amount} has been made to account ${toAccount}.</p><p>Best regards,<br>Your Banking Team</p>`; 

  await sendEmail(userEmail, subject, text, html);

}

// create send Transaction Failure Email
const sendTransactionFailureEmail = async (userEmail, name, amount, toAccount) => {
  const subject = 'Transaction Failure Notification';
  const text = `Dear ${name},\n\nWe regret to inform you that a transaction of ${amount} to account ${toAccount} has failed. Please check your account balance and try again.\n\nBest regards,\nYour Banking Team`;
  const html = `<p>Dear ${name},</p><p>We regret to inform you that a transaction of ${amount} to account ${toAccount} has failed. Please check your account balance and try again.</p><p>Best regards,<br>Your Banking Team</p>`;
  
  await sendEmail(userEmail, subject, text, html);

}



module.exports = {sendRegistrationEmail, sendTransactionEamil, sendTransactionFailureEmail};