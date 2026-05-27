const User   = require('../models/User');
const Doctor = require('../models/Doctor');
const { asyncHandler, AppError } = require('../middleware/errorMiddleware');
const { sendTokenResponse }      = require('../utils/generateToken');
const { sendEmail, welcomeEmail } = require('../utils/sendEmail');
const crypto = require('crypto');

// register a new patient account
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, gender } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError('An account with that email already exists', 400);

  const user = await User.create({ name, email, password, phone, gender, role: 'patient' });

  // send a welcome email in the background, dont block the response
  sendEmail({ to: email, subject: 'Welcome to DABMS', html: welcomeEmail(name) }).catch(console.error);

  sendTokenResponse(user, 201, res, 'Account created successfully');
});

// log in with email and password
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new AppError('Please enter your email and password', 400);

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError('Wrong email or password', 401);

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new AppError('Wrong email or password', 401);

  if (!user.isActive) throw new AppError('Your account has been disabled. Please contact support.', 403);

  sendTokenResponse(user, 200, res, 'Logged in successfully');
});

// get the currently logged in user's info
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  let doctorProfile = null;
  if (user.role === 'doctor') {
    doctorProfile = await Doctor.findOne({ user: user._id });
  }

  res.status(200).json({ success: true, user, doctorProfile });
});

// update name, phone, gender, address, profile photo
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, gender, dob, address } = req.body;

  const updates = {};
  if (name)    updates.name    = name;
  if (phone)   updates.phone   = phone;
  if (gender)  updates.gender  = gender;
  if (dob)     updates.dob     = dob;
  if (address) {
    try {
      updates.address = typeof address === 'string' ? JSON.parse(address) : address;
    } catch (err) {
      updates.address = address;
    }
  }

  if (req.file?.path) {
    updates.profileImage = req.file.path;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, message: 'Profile updated', user });
});

// change password while logged in
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) throw new AppError('Your current password is wrong', 400);

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password changed successfully');
});

// send a password reset link to the users email
exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new AppError("We couldn't find an account with that email", 404);

  const resetToken = crypto.randomBytes(20).toString('hex');

  user.resetPasswordToken  = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // expires in 10 minutes
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
    <p>Hey, you asked to reset your password.</p>
    <p>Click the button below — this link is only valid for 10 minutes:</p>
    <a href="${resetUrl}" style="background:#1a73e8;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin:16px 0;">Reset my password</a>
    <p style="color:#999;font-size:13px;">If you didn't ask for this, just ignore this email.</p>
  `;

  await sendEmail({ to: user.email, subject: 'Reset your DABMS password', html });

  res.status(200).json({ success: true, message: 'Reset link sent to your email' });
});

// actually reset the password using the token from the email link
exports.resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken:  hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new AppError('This reset link has expired or is invalid', 400);

  user.password            = req.body.password;
  user.resetPasswordToken  = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password reset successfully');
});
