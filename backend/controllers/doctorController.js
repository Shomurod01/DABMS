const User        = require('../models/User');
const Doctor      = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { asyncHandler, AppError } = require('../middleware/errorMiddleware');

// get all verified available doctors — public, used on the doctors listing page
exports.getDoctors = asyncHandler(async (req, res) => {
  const { speciality, search, page = 1, limit = 12 } = req.query;

  const filter = { isVerified: true, available: true };
  if (speciality) filter.speciality = { $regex: speciality, $options: 'i' };

  const doctors = await Doctor.find(filter)
    .populate('user', 'name email profileImage phone gender')
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  // filter by name if a search term was given
  let results = doctors;
  if (search) {
    results = doctors.filter((d) =>
      d.user.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const total = await Doctor.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: results.length,
    total,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    doctors: results,
  });
});

// get a single doctors full profile — public
exports.getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate(
    'user', 'name email profileImage phone gender'
  );

  if (!doctor) throw new AppError('Doctor not found', 404);

  res.status(200).json({ success: true, doctor });
});

// get the logged in doctors own dashboard stats
exports.getDoctorDashboard = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) throw new AppError('Doctor profile not found', 404);

  const appointments = await Appointment.find({ doctor: doctor._id })
    .populate('patient', 'name email profileImage phone')
    .sort({ createdAt: -1 });

  const pending   = appointments.filter((a) => a.status === 'pending').length;
  const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const cancelled = appointments.filter((a) => a.status === 'cancelled').length;

  // only count earnings from completed paid appointments
  const earnings = appointments
    .filter((a) => a.status === 'completed' && a.payment.status === 'paid')
    .reduce((sum, a) => sum + a.amount, 0);

  res.status(200).json({
    success: true,
    stats: { pending, confirmed, completed, cancelled, earnings },
    recentAppointments: appointments.slice(0, 5),
    doctor,
  });
});

// get all the appointments for this doctor with optional status filter
exports.getDoctorAppointments = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) throw new AppError('Doctor profile not found', 404);

  const { status, page = 1, limit = 10 } = req.query;
  const filter = { doctor: doctor._id };
  if (status) filter.status = status;

  const appointments = await Appointment.find(filter)
    .populate('patient', 'name email profileImage phone gender dob')
    .sort({ slotDate: -1 })
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

// doctor updates their own professional profile
exports.updateDoctorProfile = asyncHandler(async (req, res) => {
  const { speciality, degree, experience, about, fees, available, address } = req.body;

  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) throw new AppError('Doctor profile not found', 404);

  if (speciality !== undefined) doctor.speciality = speciality;
  if (degree      !== undefined) doctor.degree     = degree;
  if (experience  !== undefined) doctor.experience = experience;
  if (about       !== undefined) doctor.about      = about;
  if (fees        !== undefined) doctor.fees       = fees;
  if (available   !== undefined) doctor.available  = available === 'true' || available === true;
  
  if (address !== undefined) {
    try {
      doctor.address = typeof address === 'string' ? JSON.parse(address) : address;
    } catch (err) {
      doctor.address = address;
    }
  }

  await doctor.save();

  // update profile photo if one was uploaded
  if (req.file?.path) {
    await User.findByIdAndUpdate(req.user._id, { profileImage: req.file.path });
  }

  res.status(200).json({ success: true, message: 'Profile updated', doctor });
});

// doctor sets their available time slots for specific dates
exports.updateSlots = asyncHandler(async (req, res) => {
  const { slots } = req.body;

  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) throw new AppError('Doctor profile not found', 404);

  // keep any slots that are already booked, replace the rest
  const bookedSlots = doctor.slots.filter((s) => s.isBooked);
  const newSlots    = slots.map((s) => ({ ...s, isBooked: false }));

  doctor.slots = [...bookedSlots, ...newSlots];
  await doctor.save();

  res.status(200).json({ success: true, message: 'Slots updated', slots: doctor.slots });
});

// mark an appointment as done
exports.completeAppointment = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) throw new AppError('Doctor profile not found', 404);

  const appointment = await Appointment.findOne({ _id: req.params.id, doctor: doctor._id });
  if (!appointment) throw new AppError('Appointment not found', 404);

  if (appointment.status !== 'confirmed') {
    throw new AppError('Only confirmed appointments can be marked as completed', 400);
  }

  // if not paid online, assume cash payment upon completion
  if (appointment.payment.status !== 'paid') {
    appointment.payment.status = 'paid';
    appointment.payment.method = 'cash';
    appointment.payment.paidAt = new Date();
  }

  appointment.status = 'completed';
  await appointment.save();

  // update the doctors earnings and completed count
  doctor.completedAppointments += 1;
  doctor.totalEarnings += appointment.amount;
  await doctor.save();

  res.status(200).json({ success: true, message: 'Appointment marked as completed' });
});

// doctor cancels one of their appointments
exports.cancelAppointment = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) throw new AppError('Doctor profile not found', 404);

  const appointment = await Appointment.findOne({ _id: req.params.id, doctor: doctor._id });
  if (!appointment) throw new AppError('Appointment not found', 404);

  if (['completed', 'cancelled'].includes(appointment.status)) {
    throw new AppError("This appointment can't be cancelled anymore", 400);
  }

  appointment.status       = 'cancelled';
  appointment.cancelReason = reason || '';
  appointment.cancelledBy  = 'doctor';

  // free up the time slot so someone else can book it
  const slot = doctor.slots.find(
    (s) => s.date === appointment.slotDate && s.startTime === appointment.slotTime
  );
  if (slot) slot.isBooked = false;

  await appointment.save();
  await doctor.save();

  res.status(200).json({ success: true, message: 'Appointment cancelled' });
});

// get a list of all available specialities — used for the filter sidebar
exports.getSpecialities = asyncHandler(async (req, res) => {
  const specialities = await Doctor.distinct('speciality', { isVerified: true });
  res.status(200).json({ success: true, specialities });
});

// get all unique patients for this doctor
exports.getDoctorPatients = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) throw new AppError('Doctor profile not found', 404);

  const patientIds = await Appointment.distinct('patient', { doctor: doctor._id });
  const patients = await User.find({ _id: { $in: patientIds } })
    .select('name email profileImage phone gender dob');

  res.status(200).json({ success: true, count: patients.length, patients });
});

// get the appointment history of a specific patient with this doctor
exports.getPatientHistory = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) throw new AppError('Doctor profile not found', 404);

  const history = await Appointment.find({ doctor: doctor._id, patient: req.params.patientId })
    .populate('patient', 'name email profileImage phone gender dob')
    .sort({ slotDate: -1, slotTime: -1 });

  res.status(200).json({ success: true, count: history.length, history });
});
