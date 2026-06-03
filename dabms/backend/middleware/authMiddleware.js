const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// check if the request has a valid token before letting it through
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'You need to be logged in to do that' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'This account no longer exists' });
    }

    if (!req.user.isActive) {
      return res.status(401).json({ success: false, message: 'Your account has been disabled. Please contact support.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Your session has expired. Please log in again.' });
  }
};

// only let through users with the right role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `You don't have permission to do this`,
      });
    }
    next();
  };
};

const adminOnly   = authorize('admin');
const doctorOnly  = authorize('doctor');
const patientOnly = authorize('patient');
const doctorOrAdmin = authorize('doctor', 'admin');

module.exports = { protect, authorize, adminOnly, doctorOnly, patientOnly, doctorOrAdmin };
