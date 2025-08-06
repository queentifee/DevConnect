const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
const {sendEmailOtp , sendForgotPasswordOtp} = require ('../utils/sendEmailOtp');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};


exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password  ) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }
    
    try {
        const userExists = await User.findOne({ email });
    
        if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit code
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now
    
        const user = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiresAt
        
        });
        try {
            await sendEmailOtp(email, otp);
        } catch (otpError) {

            await User.findByIdAndDelete(user._id)
            return res.status (500).json ({ message: 'Failed to send OTP. Please try again'})

        }
    
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    const { email, otp} = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
     let user = await User.findOne ({ email });

      if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    if (user.otpExpiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

    user.emailVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: "7h" });


 res.status(200).json({
      message: `Email verified successfully!`,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
    } catch (error) {
        
    }

}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json(400) ({ message: "Email and password are required"})
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials"})
        
            res.json ({
                message: 'Log in successful',
                id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
    } catch (error) {
        res.status(500).json ({ message: "Server error", error: error.message});
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json ({ message: "User not found" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();
    await sendForgotPasswordOtp(email, otp)
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error:", err});
  }
};

exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body

    try {
        let user = await User.findOne({ email });

 if ( user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successful"})
    } catch (err) {
        console.error(err)     ;
        res.status(500).json ({ message: "Server error:", err});
    }
};