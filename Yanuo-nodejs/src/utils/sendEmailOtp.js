const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },
    secure: false,
});

transporter.verify((error, success) => {
    if (error)
    {
        console.log(error);
    }
    else
    {
        console.log("Ready for messages");
        console.log(success);
    }
});

const sendEmail = async (mailOptions) => {
    try
    {
        await transporter.sendMail(mailOptions);
    }
    catch (error)
    {
        throw error;
    }
}

module.exports = sendEmail;