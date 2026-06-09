# DABMS — Doctor Appointment Booking & Management System

A full-stack web app built with the MERN stack that lets patients book appointments with doctors, doctors manage their schedules, and admins keep an eye on everything.

---

## Before you start

You'll need accounts on these free services:

- **MongoDB Atlas** — https://mongodb.com/atlas (free tier)
- **Cloudinary** — https://cloudinary.com (free tier, for profile photos)
- **PayPal Developer** — https://developer.paypal.com (sandbox for testing)
- **Gmail** — for sending emails (needs an App Password, not your normal login)

---

## Getting it running

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Set up your environment variables

```bash
cd backend
copy .env.example .env
```

Open `.env` and fill in your real values. At minimum you need:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/dabms
JWT_SECRET=makethisalongrandomstring
FRONTEND_URL=http://localhost:5173
```

The rest (Cloudinary, PayPal, Email) can be added later — the app will run without them, just without image uploads, payments, or emails.

### 3. Set up the frontend env

```bash
cd frontend
copy .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
```

### 4. Create an admin account

After the backend starts, you need to manually create an admin user in MongoDB Atlas. Go to your database, open the `users` collection, and insert:

```json
{
  "name": "Admin",
  "email": "admin@dabms.com",
  "password": "$2a$12$...",
  "role": "admin",
  "isActive": true
}
```

Or just register normally through the app and then change the role to `admin` in MongoDB Atlas.

### 5. Start both servers

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## What each user can do

### Patient

- Create an account and log in
- Search for doctors by name or speciality
- Pick a date and time slot and book an appointment
- Pay the consultation fee through PayPal
- Cancel an appointment if needed
- Edit their profile

### Doctor

- Log in (account is created by admin)
- Set their available dates and time slots
- Confirm, complete, or cancel appointments
- See their earnings on the dashboard
- Update their profile and professional info

### Admin

- Add new doctors to the system
- Verify or unverify doctor accounts
- Enable or disable any user
- Cancel any appointment
- See revenue stats and recent activity on the dashboard

---

## Tech stack

| Part          | Technology                                    |
| ------------- | --------------------------------------------- |
| Frontend      | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend       | Node.js, Express.js                           |
| Database      | MongoDB + Mongoose                            |
| Auth          | JWT + bcryptjs                                |
| Image storage | Cloudinary                                    |

---

## A few things to know

- Node.js v18 or later is required (the project uses native `fetch`)
- For Gmail, you need to create an **App Password** — go to your Google account → Security → 2-Step Verification → App passwords
- PayPal sandbox lets you test payments without real money
- Doctor accounts can only be created by an admin — they can't self-register

