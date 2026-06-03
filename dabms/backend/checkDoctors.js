const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');
const User = require('./models/User');

dotenv.config();

const checkDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const doctors = await Doctor.find().populate('user', 'name email profileImage');
    doctors.forEach(d => {
      console.log(`Doctor: ${d.user.name}`);
      console.log(`Email: ${d.user.email}`);
      console.log(`isVerified: ${d.isVerified}`);
      console.log(`available: ${d.available}`);
      console.log(`profileImage: ${d.user.profileImage}`);
      console.log('---');
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkDoctors();
