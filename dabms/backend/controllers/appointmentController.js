const Appointment = require('../models/Appointment');
const Doctor      = require('../models/Doctor');
const { asyncHandler, AppError } = require('../middleware/errorMiddleware');
const { sendEmail, appointmentConfirmedEmail } = require('../utils/sendEmail');

// book a new appointment — only patients can do this
exports.bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, slotDate, slotTime, notes } = req.body;

  const doctor = await Doctor.findById(doctorId).populate('user', 'name email profileImage');
  if (!doctor) throw new AppError('Doctor not found', 404);

  if (!doctor.isVerified) throw new AppError("This doctor hasn't been verified yet", 400);
  if (!doctor.available)  throw new AppError("This doctor isn't accepting appointments right now", 400);

  // check the slot actually exists and is free
  const slot = doctor.slots.find(
    (s) => s.date === slotDate && s.startTime === slotTime && !s.isBooked
  );
  if (!slot) throw new AppError('That time slot is no longer available', 400);

  // dont let a patient double-book the same doctor at the same time
  const existing = await Appointment.findOne({
    patient:  req.user._id,
    doctor:   doctorId,
    slotDate,
    slotTime,
    status:   { $in: ['pending', 'confirmed'] },
  });
  if (existing) throw new AppError('You already have an appointment at this time', 400);

  const patient = req.user;

  const appointment = await Appointment.create({
    patient:  patient._id,
    doctor:   doctorId,
    slotDate,
    slotTime,
    amount:   doctor.fees,
    notes:    notes || '',
    // save a snapshot of the patient and doctor info at booking time
    patientData: {
      name:    patient.name,
      email:   patient.email,
      phone:   patient.phone,
      gender:  patient.gender,
      dob:     patient.dob,
      address: patient.address,
      image:   patient.profileImage,
    },
    doctorData: {
      name:       doctor.user.name,
      speciality: doctor.speciality,
      fees:       doctor.fees,
      image:      doctor.user.profileImage,
    },
  });

  // mark the slot as taken
  slot.isBooked = true;
  await doctor.save();

  const addressString = [doctor.address?.line1, doctor.address?.line2].filter(Boolean).join(', ');

  // send a confirmation email in the background
  sendEmail({
    to:      patient.email,
    subject: 'Appointment booked!',
    html:    appointmentConfirmedEmail(patient.name, doctor.user.name, slotDate, slotTime, addressString),
  }).catch(console.error);

  res.status(201).json({ success: true, message: 'Appointment booked successfully', appointment });
});

// get a single appointment by ID
exports.getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patient', 'name email profileImage phone gender dob address')
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email profileImage phone' } });

  if (!appointment) throw new AppError('Appointment not found', 404);

  // only the patient, the doctor, or an admin can view this
  const userId    = req.user._id.toString();
  const isPatient = appointment.patient._id.toString() === userId;
  const isAdmin   = req.user.role === 'admin';

  let isDoctor = false;
  if (req.user.role === 'doctor') {
    const doctorProfile = await require('../models/Doctor').findOne({ user: req.user._id });
    isDoctor = doctorProfile && appointment.doctor._id.toString() === doctorProfile._id.toString();
  }

  if (!isPatient && !isAdmin && !isDoctor) {
    throw new AppError("You don't have permission to view this appointment", 403);
  }

  res.status(200).json({ success: true, appointment });
});

// doctor confirms a pending appointment
exports.confirmAppointment = asyncHandler(async (req, res) => {
  const doctorProfile = await require('../models/Doctor').findOne({ user: req.user._id });
  if (!doctorProfile) throw new AppError('Doctor profile not found', 404);

  const appointment = await Appointment.findOne({
    _id:    req.params.id,
    doctor: doctorProfile._id,
  });

  if (!appointment) throw new AppError('Appointment not found', 404);
  if (appointment.status !== 'pending') throw new AppError('This appointment is no longer pending', 400);

  appointment.status = 'confirmed';
  await appointment.save();

  res.status(200).json({ success: true, message: 'Appointment confirmed', appointment });
});
