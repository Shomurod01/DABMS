const Appointment = require('../models/Appointment');
const { asyncHandler, AppError } = require('../middleware/errorMiddleware');
// Native fetch used (Node 18+)

// ─── PayPal Helper Functions ──────────────────────────────────────────────────

const PAYPAL_BASE = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const getPayPalAccessToken = async () => {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
};

// @desc    Create PayPal order for an appointment
// @route   POST /api/payment/create-order/:appointmentId
// @access  Private (patient)
exports.createPayPalOrder = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.appointmentId);
  if (!appointment) throw new AppError('Appointment not found', 404);

  if (appointment.patient.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  if (appointment.payment.status === 'paid') {
    throw new AppError('Appointment already paid', 400);
  }

  const accessToken = await getPayPalAccessToken();

  const orderPayload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: appointment._id.toString(),
        description:  `Doctor Appointment - ${appointment.doctorData.name}`,
        amount: {
          currency_code: 'PLN',
          value: appointment.amount.toFixed(2),
        },
      },
    ],
    application_context: {
      brand_name:          'DABMS Healthcare',
      landing_page:        'NO_PREFERENCE',
      user_action:         'PAY_NOW',
      return_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    },
  };

  const response = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderPayload),
  });

  const order = await response.json();

  if (!response.ok) {
    throw new AppError(order.message || 'PayPal order creation failed', 500);
  }

  // Store PayPal order ID on appointment
  appointment.payment.paypalOrderId = order.id;
  await appointment.save();

  res.status(200).json({ success: true, orderId: order.id, order });
});

// @desc    Capture PayPal payment after approval
// @route   POST /api/payment/capture-order/:appointmentId
// @access  Private (patient)
exports.capturePayPalOrder = asyncHandler(async (req, res) => {
  const { paypalOrderId } = req.body;

  const appointment = await Appointment.findById(req.params.appointmentId);
  if (!appointment) throw new AppError('Appointment not found', 404);

  if (appointment.patient.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const captureData = await response.json();

  if (!response.ok || captureData.status !== 'COMPLETED') {
    throw new AppError('Payment capture failed', 400);
  }

  // Update appointment payment details
  appointment.payment.status        = 'paid';
  appointment.payment.method        = 'paypal';
  appointment.payment.transactionId = captureData.purchase_units[0].payments.captures[0].id;
  appointment.payment.paypalOrderId = paypalOrderId;
  appointment.payment.paidAt        = new Date();
  appointment.status                = 'confirmed';
  await appointment.save();

  res.status(200).json({
    success: true,
    message: 'Payment successful',
    appointment,
    captureData,
  });
});

// @desc    Get PayPal client ID (public - needed by frontend SDK)
// @route   GET /api/payment/paypal-client-id
// @access  Public
exports.getPayPalClientId = asyncHandler(async (req, res) => {
  res.status(200).json({
    success:  true,
    clientId: process.env.PAYPAL_CLIENT_ID,
  });
});

// @desc    Verify payment status of an appointment
// @route   GET /api/payment/verify/:appointmentId
// @access  Private
exports.verifyPayment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.appointmentId);
  if (!appointment) throw new AppError('Appointment not found', 404);

  res.status(200).json({
    success:       true,
    paymentStatus: appointment.payment.status,
    payment:       appointment.payment,
  });
});
