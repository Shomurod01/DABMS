const jwt = require('jsonwebtoken');

// create a JWT token for the given user ID
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// send the token + user info back in the response
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      _id:          user._id,
      name:         user.name,
      email:        user.email,
      role:         user.role,
      profileImage: user.profileImage,
      phone:        user.phone,
      gender:       user.gender,
    },
  });
};

module.exports = { generateToken, sendTokenResponse };
