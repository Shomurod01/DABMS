const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

dotenv.config();

const specializations = [
  { spec: 'Neurologist', name: 'Dr. Robert King', email: 'dr.king@dabms.com', gender: 'Male', img: '/doctor_king.png' },
  { spec: 'Pediatrician', name: 'Dr. Sarah Connor', email: 'dr.connor@dabms.com', gender: 'Female', img: '/doctor_sarah.png' },
  { spec: 'Orthopedic', name: 'Dr. Michael Chang', email: 'dr.chang@dabms.com', gender: 'Male', img: '/doctor_chang.png' }
];

const seedMoreDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    for (const doc of specializations) {
      const exists = await User.findOne({ email: doc.email });
      if (!exists) {
        const user = await User.create({
          name: doc.name,
          email: doc.email,
          password: 'Doctor@123',
          phone: `555${Math.floor(Math.random() * 899999 + 100000)}`,
          gender: doc.gender,
          role: 'doctor',
          profileImage: doc.img,
        });
        
        await Doctor.create({
          user: user._id,
          speciality: doc.spec,
          degree: 'MD',
          experience: Math.floor(Math.random() * 15) + 5,
          about: `Experienced ${doc.spec} providing expert care.`,
          fees: Math.floor(Math.random() * 5 + 10) * 10,
          address: { line1: '123 Medical Bd', line2: 'City Center' },
          available: true,
          isVerified: true,
          slots: [
            { date: '2026-04-02', startTime: '10:00', endTime: '10:30', isBooked: false },
            { date: '2026-04-02', startTime: '11:00', endTime: '11:30', isBooked: false }
          ]
        });
        console.log(`${doc.spec} added: ${doc.name}`);
      }
    }

    console.log('Seeding successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedMoreDoctors();
