const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, 
        required: [true, 'Please add a name'] },
    email: { type: String, 
        required: [true, 'Please add an email'],
unique: true },
otp: String,
 otpExpiresAt: {
  type: Date,
},
resetOtp: {type: String},
    resetOtpExpires: {type: Date},
    password: { type: String,
               required: [true, 'Please add a password'] },
               currentRole: String,
    date: { type: Date, default: Date.now },
    emailVerified: { type: Boolean, default: false },
    emailVerificationOtp: { type: String },
emailVerificationExpires: { type: Date },
 profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
        files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],


});

const User = mongoose.model('User', userSchema);

module.exports = User;
