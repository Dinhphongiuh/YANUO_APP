const OTP = require('../models/otp');
const sendEmail = require('../utils/sendEmailOtp');
const {hashData} = require('../utils/hashDataOtp');
const generateOtp = require('../utils/generateOtp');

sendOtp = async ({email, subject, message, duration = 1}) => {
    try
    {
        if (!(email && subject && message))
        {
            throw Error("Provide values for email, subject, message");
        }

        await OTP.deleteOne({email});

        const generatedOTP = await generateOtp();

        // send email
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject,
            html: `<p>${message}</p><p style="color:tomato;font-size:25px;letter-spacing:2px;"><b>${generatedOTP}</b></p><p>This code <b>express in ${duration} hour(s)</b>.</p>`,
        }
        await sendEmail(mailOptions);

        // save otp record
        const hashedOTP = await hashData(generatedOTP);
        // console.log(hashedOTP);
        const newOTP = await new OTP({
            email,
            otp: hashedOTP,
            createAt: Date.now(),
            expiresAt: Date.now() + 3600000 * + duration,
        });
        
        const createdOTPRecord = await newOTP.save();
        return createdOTPRecord;
    }
    catch (error)
    {
        throw error;
    }
};

module.exports = sendOtp;