const express = require('express');
const router  = express.Router();

const {
  createPayPalOrder,
  capturePayPalOrder,
  getPayPalClientId,
  verifyPayment,
} = require('../controllers/paymentController');

const { protect } = require('../middleware/authMiddleware');

router.get('/paypal-client-id',               getPayPalClientId);
router.post('/create-order/:appointmentId',   protect, createPayPalOrder);
router.post('/capture-order/:appointmentId',  protect, capturePayPalOrder);
router.get('/verify/:appointmentId',          protect, verifyPayment);

module.exports = router;
