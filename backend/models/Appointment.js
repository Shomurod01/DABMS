const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    slotDate: {
      type: String,
      required: true, 
    },
    slotTime: {
      type: String,
      required: true, 
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    amount: {
      type: Number,
      required: true,
    },
    payment: {
      status: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending',
      },
      method:        { type: String, default: '' },
      transactionId: { type: String, default: '' },
      paypalOrderId: { type: String, default: '' },
      paidAt:        { type: Date },
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    cancelReason: {
      type: String,
    },
    cancelledBy: {
      type: String,
      enum: ['patient', 'doctor', 'admin', ''],
      default: '',
    },

    patientData: {
      name:   String,
      email:  String,
      phone:  String,
      gender: String,
      dob:    Date,
      address: {
        line1: String,
        line2: String,
      },
      image: String,
    },
   
    doctorData: {
      name:       String,
      speciality: String,
      fees:       Number,
      image:      String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
