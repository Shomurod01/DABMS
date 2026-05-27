const Doctor      = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { asyncHandler, AppError } = require('../middleware/errorMiddleware');

// get all appointments belonging to the logged in patient
exports.getMyAppointments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const filter = { patient: req.user._id };
  if (status) filter.status = status;

  const appointments = await Appointment.find(filter)
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email profileImage phone' },
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Appointment.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: appointments.length,
    total,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    appointments,
  });
});

// patient cancels one of their own appointments
exports.cancelAppointment = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const appointment = await Appointment.findOne({
    _id:     req.params.id,
    patient: req.user._id,
  });

  if (!appointment) throw new AppError('Appointment not found', 404);

  if (['completed', 'cancelled'].includes(appointment.status)) {
    throw new AppError("This appointment can't be cancelled", 400);
  }

  appointment.status       = 'cancelled';
  appointment.cancelReason = reason || '';
  appointment.cancelledBy  = 'patient';
  await appointment.save();

  // free up the doctors slot so someone else can book it
  const doctor = await Doctor.findById(appointment.doctor);
  if (doctor) {
    const slot = doctor.slots.find(
      (s) => s.date === appointment.slotDate && s.startTime === appointment.slotTime
    );
    if (slot) slot.isBooked = false;
    await doctor.save();
  }

  res.status(200).json({ success: true, message: 'Appointment cancelled' });
});

// get quick stats for the patients dashboard
exports.getPatientDashboard = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id })
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name profileImage' },
    })
    .sort({ createdAt: -1 });

  const pending   = appointments.filter((a) => a.status === 'pending').length;
  const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const cancelled = appointments.filter((a) => a.status === 'cancelled').length;

  res.status(200).json({
    success: true,
    stats: { total: appointments.length, pending, confirmed, completed, cancelled },
    recentAppointments: appointments.slice(0, 5),
  });
});
