const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Appointment = require('./models/Appointment');
const Doctor = require('./models/Doctor');

dotenv.config();

const fixDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Find all appointments that are completed but payment is not paid
    const appointments = await Appointment.find({ 
      status: 'completed', 
      'payment.status': { $ne: 'paid' } 
    });

    console.log(`Found ${appointments.length} appointments to fix.`);

    for (let app of appointments) {
      app.payment.status = 'paid';
      app.payment.method = 'cash';
      app.payment.paidAt = app.updatedAt || new Date();
      await app.save();

      // Ensure doctor earnings are correct
      const doctor = await Doctor.findById(app.doctor);
      if (doctor) {
        doctor.totalEarnings += app.amount;
        await doctor.save();
      }
    }

    console.log('✅ Fixed earnings and payment statuses retroactively!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error fixing DB:', err);
    process.exit(1);
  }
};

fixDb();
