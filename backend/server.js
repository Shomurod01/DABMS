const express = require('express');
 const mongoose = require('mongoose');
  const cors = require('cors');
 const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const authRoutes        = require('./routes/authRoutes');
 const patientRoutes     = require('./routes/patientRoutes');
  const doctorRoutes      = require('./routes/doctorRoutes');
   const adminRoutes       = require('./routes/adminRoutes');
  const appointmentRoutes = require('./routes/appointmentRoutes');
   const paymentRoutes     = require('./routes/paymentRoutes');

app.use('/api/auth',         authRoutes);
  app.use('/api/patient',      patientRoutes);
 app.use('/api/doctor',       doctorRoutes);
 app.use('/api/admin',        adminRoutes);
 app.use('/api/appointments', appointmentRoutes);
app.use('/api/payment',      paymentRoutes);


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date() });
});


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  if (statusCode >= 500) {
    console.error(err.stack);
  } else {
    console.log(`⚠️ API Error: ${err.message}`);
  }
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong on our end',
  });
});


app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'This route does not exist' });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Could not connect to MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;
