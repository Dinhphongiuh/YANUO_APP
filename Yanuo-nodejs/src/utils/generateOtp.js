const generateOtp = async () => {
    try {
        return (otp = `${10000 + Math.floor(100000 + Math.random() * 900000)}`);
    } catch (error) {
        throw error;
    }
}

module.exports = generateOtp;