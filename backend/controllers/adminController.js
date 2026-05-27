const User        = require('../models/User');
const Doctor      = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { asyncHandler, AppError } = require('../middleware/errorMiddleware');


exports.getAdminDashboard = asyncHandler(async (req, res) => {
  const totalDoctors        = await Doctor.countDocuments();
  const pendingVerification = await Doctor.countDocuments({ isVerified: false });
  const totalPatients       = await User.countDocuments({ role: 'patient' });
  const totalAppointments   = await Appointment.countDocuments();

  const recentAppointments = await Appointment.find()
    .populate('patient', 'name email profileImage')
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name profileImage' } })
    .sort({ createdAt: -1 })
    .limit(8);

 
  const revenue = await Appointment.aggregate([
    { $match: { 'payment.status': 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

 
  const monthlyRevenue = await Appointment.aggregate([
    { $match: { 'payment.status': 'paid' } },
    {
      $group: {
        _id:   { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalDoctors,
      pendingVerification,
      totalPatients,
      totalAppointments,
      totalRevenue: revenue[0]?.total || 0,
    },
    recentAppointments,
    monthlyRevenue,
  });
});


exports.getAllUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 20, search } = req.query;
  const filter = {};
  if (role)   filter.role = role;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await User.countDocuments(filter);

  res.status(200).json({ success: true, count: users.length, total, users });
});

exports.toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
    isActive: user.isActive,
  });
});

exports.addDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, phone, gender, speciality, degree, experience, about, fees, address } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError('That email is already registered', 400);

  const user = await User.create({
    name, email, password, phone, gender,
    role: 'doctor',
    profileImage: req.file?.path || '',
  });

  const doctor = await Doctor.create({
    user: user._id,
    speciality, degree,
    experience: parseInt(experience),
    about,
    fees: parseFloat(fees),
    address: address ? JSON.parse(address) : {},
    isVerified: true,
  });

  res.status(201).json({ success: true, message: 'Doctor added successfully', doctor, user });
});


exports.getAllDoctors = asyncHandler(async (req, res) => {
  const { verified, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (verified !== undefined) filter.isVerified = verified === 'true';

  const doctors = await Doctor.find(filter)
    .populate('user', 'name email profileImage phone gender isActive')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Doctor.countDocuments(filter);

  res.status(200).json({ success: true, count: doctors.length, total, doctors });
});

exports.verifyDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw new AppError('Doctor not found', 404);

  doctor.isVerified = !doctor.isVerified;
  await doctor.save();

  res.status(200).json({
    success: true,
    message: `Doctor ${doctor.isVerified ? 'verified' : 'unverified'}`,
    isVerified: doctor.isVerified,
  });
});


exports.updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw new AppError('Doctor not found', 404);

  const fields = ['speciality', 'degree', 'experience', 'about', 'fees', 'available', 'address'];
  fields.forEach((f) => { 
    if (req.body[f] !== undefined) {
      if (f === 'address' && typeof req.body[f] === 'string') {
        try { doctor[f] = JSON.parse(req.body[f]); } catch(e) { doctor[f] = req.body[f]; }
      } else if (f === 'available' && typeof req.body[f] === 'string') {
        doctor[f] = req.body[f] === 'true';
      } else {
        doctor[f] = req.body[f]; 
      }
    } 
  });

  await doctor.save();
  res.status(200).json({ success: true, message: 'Doctor updated', doctor });
});


exports.getAllAppointments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const appointments = await Appointment.find(filter)
    .populate('patient', 'name email profileImage')
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name profileImage' } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Appointment.countDocuments(filter);

  res.status(200).json({ success: true, count: appointments.length, total, appointments });
});


exports.cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) throw new AppError('Appointment not found', 404);

  if (['completed', 'cancelled'].includes(appointment.status)) {
    throw new AppError("This appointment can't be cancelled", 400);
  }

  appointment.status       = 'cancelled';
  appointment.cancelReason = req.body.reason || 'Cancelled by admin';
  appointment.cancelledBy  = 'admin';
  await appointment.save();

  res.status(200).json({ success: true, message: 'Appointment cancelled' });
});
