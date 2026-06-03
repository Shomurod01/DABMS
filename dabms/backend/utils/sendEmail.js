const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_app_password') {
    console.log('[MOCK EMAIL SENT]');
    console.log(`To: ${to} | Subject: ${subject}`);
    return { messageId: 'mock-id' };
  }

  const mailOptions = {
    from: `"DABMS Healthcare" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('Failed to send email:', err.message);
    throw err;
  }
};

// sent when a patient books an appointment
const appointmentConfirmedEmail = (patientName, doctorName, date, time, address) => `
<div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #f9fafb; border-radius: 12px; overflow: hidden;">
  <div style="background: linear-gradient(135deg, #1a73e8, #0d47a1); padding: 40px 32px;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Your appointment is confirmed</h1>
  </div>
  <div style="padding: 32px;">
    <p style="font-size: 16px; color: #374151;">Hi <strong>${patientName}</strong>,</p>
    <p style="font-size: 15px; color: #6b7280;">Great news — your appointment is all set. Here are the details:</p>
    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb;">
      <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      ${address ? `<p><strong>Location:</strong> ${address}</p>` : ''}
    </div>
    <p style="color: #6b7280; font-size: 14px;">Try to arrive about 10 minutes early. See you soon!</p>
  </div>
</div>
`;

// sent when an appointment gets cancelled
const appointmentCancelledEmail = (name, doctorName, date, time, reason) => `
<div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto;">
  <div style="background: #dc2626; padding: 32px;">
    <h1 style="color: white; margin: 0;">Appointment cancelled</h1>
  </div>
  <div style="padding: 32px; background: #f9fafb;">
    <p>Hi <strong>${name}</strong>,</p>
    <p>Your appointment with <strong>Dr. ${doctorName}</strong> on <strong>${date}</strong> at <strong>${time}</strong> has been cancelled.</p>
    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    <p style="color: #6b7280;">You can book a new appointment whenever you're ready.</p>
  </div>
</div>
`;

// sent right after someone creates an account
const welcomeEmail = (name) => `
<div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto;">
  <div style="background: linear-gradient(135deg, #059669, #047857); padding: 40px 32px;">
    <h1 style="color: white; margin: 0;">Welcome to DABMS</h1>
  </div>
  <div style="padding: 32px; background: #f9fafb;">
    <p>Hi <strong>${name}</strong>, glad you joined us!</p>
    <p>Here's what you can do right now:</p>
    <ul>
      <li>Browse verified doctors and check their availability</li>
      <li>Book an appointment in just a few clicks</li>
      <li>Track all your upcoming and past appointments</li>
    </ul>
    <p style="color: #6b7280; font-size: 14px;">If you ever run into trouble, just reach out to our support team.</p>
  </div>
</div>
`;

module.exports = {
  sendEmail,
  appointmentConfirmedEmail,
  appointmentCancelledEmail,
  welcomeEmail,
};
