const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Doctor = require('./models/Doctor');


dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // 1. Create Admin
    const adminExists = await User.findOne({ email: 'admin@dabms.com' });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@dabms.com',
        password: 'Admin@123456',
        phone: '1234567890',
        gender: 'Male',
        role: 'admin'
      });
      console.log('✅ Admin user added: admin@dabms.com');
    } else {
      console.log('⚡ Admin already exists.');
    }

    // 2. Create Doctors
    const doctor1Exists = await User.findOne({ email: 'dr.smith@dabms.com' });
    if (!doctor1Exists) {
      const user1 = await User.create({
        name: 'Dr. John Smith',
        email: 'dr.smith@dabms.com',
        password: 'Doctor@123',
        phone: '0987654321',
        gender: 'Male',
        role: 'doctor',
        profileImage: '/doctor_smith.png',
      });
      
      await Doctor.create({
        user: user1._id,
        speciality: 'Cardiologist',
        degree: 'MD, PhD',
        experience: 10,
        about: 'Expert cardiologist with 10 years of experience.',
        fees: 150,
        address: { line1: '123 Heart Center', line2: 'New York, NY' },
        available: true,
        isVerified: true,
        slots: [
          { date: '2026-04-01', startTime: '09:00', endTime: '09:30', isBooked: false },
          { date: '2026-04-01', startTime: '10:00', endTime: '10:30', isBooked: false }
        ]
      });
      console.log('✅ Doctor John Smith added: dr.smith@dabms.com');
    }

    const doctor2Exists = await User.findOne({ email: 'dr.jane@dabms.com' });
    if (!doctor2Exists) {
      const user2 = await User.create({
        name: 'Dr. Jane Doe',
        email: 'dr.jane@dabms.com',
        password: 'Doctor@123',
        phone: '1112223333',
        gender: 'Female',
        role: 'doctor',
        profileImage: '/doctor_jane.png',
      });
      
      await Doctor.create({
        user: user2._id,
        speciality: 'Dermatologist',
        degree: 'MBBS, MD',
        experience: 5,
        about: 'Skin specialist providing advanced treatments.',
        fees: 100,
        address: { line1: '456 Skin Clinic', line2: 'Los Angeles, CA' },
        available: true,
        isVerified: true,
        slots: [
          { date: '2026-04-01', startTime: '14:00', endTime: '14:30', isBooked: false },
          { date: '2026-04-01', startTime: '15:00', endTime: '15:30', isBooked: false }
        ]
      });
      console.log('✅ Doctor Jane Doe added: dr.jane@dabms.com');
    }

    console.log('🎉 Seeding successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
