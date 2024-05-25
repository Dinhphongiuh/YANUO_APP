const sendOtp = require('../services/otp');
const OTP = require('../models/otp');
const { verifyHashedData } = require('../utils/hashDataOtp');

exports.sendOTP = async (req, res) => {
    try
    {
        const {email, subject, message, duration} = req.body;

        const createdOTP = await sendOtp({
            email,
            subject,
            message,
            duration,
        });
        res.status(200).json(createdOTP);
    }
    catch (error)
    {
        res.status(400).send(error.message)
    }
}

// XACS THUC
exports.verifyOTP = async (req, res) => {
    const {email, otpCode} = req.body;
    try {
      // Tìm bản ghi OTP bằng email và kiểm tra thời gian hết hạn
      const otpRecord = await OTP.findOne({
        email: email,
        expiresAt: { $gt: Date.now() } // $gt là toán tử "greater than" trong MongoDB
      });
    //   console.log(otpRecord);
      // Nếu không tìm thấy bản ghi hoặc đã hết hạn
      if (!otpRecord) {
        return { success: false, message: 'OTP is invalid or has expired.' };
      }
    //   console.log('otp', otpCode.toString());
      const otpStr = otpCode.toString();
      // Kiểm tra mã OTP
      const isOtpValid = await verifyHashedData(otpStr, otpRecord.otp);
    //   console.log('kq: ', isOtpValid);
      if (!isOtpValid) {
        return res.status(401).json({ success: false, message: 'Invalid OTP code.' });
      }
  
      // OTP hợp lệ và còn hiệu lực
      return res.status(200).json({ success: true, message: 'OTP is valid.' });
    } catch (error) {
    //   throw error;
        return res.status(400).json(error)
    }
};