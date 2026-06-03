const express = require('express');
const router  = express.Router();

const {
  getMyAppointments,
   cancelAppointment,
     getPatientDashboard,
} = require('../controllers/patientController');

const { protect, patientOnly } = require('../middleware/authMiddleware');

router.get('/dashboard',                  protect, patientOnly, getPatientDashboard);
 router.get('/appointments',                 protect, patientOnly, getMyAppointments);
router.put('/appointment/:id/cancel',          protect, patientOnly, cancelAppointment);

module.exports = router;
