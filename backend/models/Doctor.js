const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date:      { type: String, required: true }, 
   startTime: { type: String, required: true },  
    endTime:   { type: String, required: true },
          isBooked:  { type: Boolean, default: false },
});

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    speciality: {
      type: String,
      required: [true, 'Speciality is required'],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
    about: {
      type: String,
      trim: true,
      maxlength: [1000, 'About cannot exceed 1000 characters'],
    },
    fees: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: [0, 'Fee cannot be negative'],
    },
    address: {
      line1: { type: String, default: '' },
      line2: { type: String, default: '' },
    },
    available: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    slots: [slotSchema],
    totalEarnings: {
      type: Number,
      default: 0,
    },
    completedAppointments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
