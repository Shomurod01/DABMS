const express = require('express');
const router  = express.Router();

const {
  bookAppointment,
  getAppointmentById,
  confirmAppointment,
} = require('../controllers/appointmentController');

const { protect, patientOnly, doctorOnly } = require('../middleware/authMiddleware');

router.post('/book',              protect, patientOnly, bookAppointment);
router.get('/:id',                protect, getAppointmentById);
router.put('/:id/confirm',        protect, doctorOnly, confirmAppointment);

module.exports = router;
