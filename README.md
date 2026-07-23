# 🩸 BloodConnect - Blood Donation Portal

A professional, full-stack Blood Donation Portal built with Node.js, Express.js, MongoDB, and EJS. This platform connects blood donors with recipients, manages emergency requests, generates donation certificates, and helps save lives.

![Blood Donation](https://img.shields.io/badge/Blood%20Donation-Save%20Lives-red)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green)
![License](https://img.shields.io/badge/License-ISC-blue)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## 📋 Table of Contents

- [Features](#-features)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Admin Access](#-admin-access)
- [Seed Data](#-seed-data)
- [Email System](#-email-system)
- [Donation Certificate](#-donation-certificate)
- [API Routes](#-api-routes)
- [Security](#-security)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Author](#-author)

---

## ✨ Features

### 🏠 Public Features
- **Home Page**: Landing page with real-time stats (donors, requests, lives saved)
- **Donor Search**: Find donors by blood group, city, state, pincode
- **Emergency Request**: Create urgent blood requests with email notifications to matching donors
- **User Registration/Login**: Secure JWT authentication with login alerts
- **Contact Form**: Send messages to administrators
- **About Page**: Mission, impact stats, blood compatibility chart, eligibility criteria, testimonials

### 👤 Donor Features
- **Dashboard**: Profile completion tracker, donation count, nearby emergency requests
- **Profile Management**: Update personal info, medical status, availability toggle
- **Document Upload**: Government ID, blood reports, profile photo (Multer)
- **Donation History**: Track all blood donations with dates and hospitals
- **Donation Certificate**: Generate printable certificate after each donation
- **Nearby Alerts**: View emergency requests in your city

### 👑 Admin Features
- **Statistics Dashboard**: Real-time counts of users, donors, requests, messages
- **User Management**: Search, filter, verify, reject, block/unblock, delete users
- **Donor Verification**: Approve/reject donor documents
- **Emergency Management**: Track and update request status (pending/fulfilled/cancelled)
- **Contact Messages**: View and manage messages from contact form

### 🔔 Email Notifications
- **Welcome Email** - On registration with account details
- **Login Alert** - Security alert on every login with timestamp
- **Emergency Alert** - Sent to matching donors in same city
- **Donation Confirmation** - With certificate link after recording donation
- **Password Reset** - Secure reset link via email
- **Verification Update** - On approval/rejection of donor verification

### 🏆 Donation Certificate
- Professional printable certificate with donor details
- Blood group, units, hospital, date displayed
- Certificate ID for verification
- Print button for physical copy

---

## 🎯 Live Demo

| Page | URL |
|------|-----|
| Home | `/` |
| Register | `/auth/register` |
| Login | `/auth/login` |
| Find Donors | `/donor/search` |
| Emergency | `/emergency/create` |
| Admin Panel | `/admin/dashboard` |
| Certificate | `/donor/certificate/:id` |

---

## 💻 Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 5.x |
| **Database** | MongoDB 7.0+ (Mongoose ODM) |
| **Authentication** | JWT + bcrypt (10 salt rounds) |
| **Template Engine** | EJS (Server-Side Rendering) |
| **CSS Framework** | Bootstrap 5.3 |
| **Icons** | Font Awesome 6.4 |
| **Email Service** | Nodemailer (Gmail SMTP) |
| **File Upload** | Multer |
| **Validation** | express-validator |
| **Session** | express-session |
| **Animations** | AOS (Animate on Scroll) |

---

## 📸 Screenshots

### Home Page
- Hero section with CTA buttons
- Real-time statistics counter (donors, requests, lives saved)
- Feature cards (Quick Search, Verified Donors, Emergency Response)
- Clickable blood group cards
- Call to action section

### Donor Dashboard
- Welcome message with donor name
- Profile completion progress bar
- Quick stats (donations, availability, location)
- Blood group badge
- Nearby emergency requests list
- Record donation form

### Donation Certificate
- Professional border design
- Donor name in large red text
- Blood group highlighted
- All donation details table
- Certificate ID
- Print button

### Admin Panel
- Stats overview cards
- User management table with search & filters
- Action buttons (verify, reject, block, delete)
- Emergency request tracking
- Contact messages inbox

### Donor Search
- Filter by blood group, state, city, pincode
- Donor cards with photo, name, blood group, location
- Availability badge
- Pagination

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local or MongoDB Atlas)
- **Gmail Account** (for email notifications - optional)

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/Ankit-rajan/Blood-Donation-Portal.git
cd Blood-Donation-Portal

# 2. Install dependencies
npm install

# 3. Create upload directories
mkdir uploads\profiles uploads\documents

# 4. Create .env file (copy and edit)
```

### .env Configuration
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bloodDonationPortal
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
NODE_ENV=development
BASE_URL=http://localhost:3000
ADMIN_SECRET_CODE=admin123
```

### Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm start

# Seed sample data
node seed.js
```

Open: **http://localhost:3000**

---

## 👑 Admin Access

### Method 1: Admin Secret Code (EASIEST)
1. Go to: `/auth/register`
2. Fill all details
3. In **"Admin Code"** field enter: **`admin123`**
4. Register → Direct Admin Dashboard!

### Method 2: Make Existing User Admin
```
http://localhost:3000/make-admin/your_email@gmail.com
```

### Method 3: MongoDB Atlas (Manual)
1. Atlas → Browse Collections → `users`
2. Find user → Edit → Change `role` to `"admin"`

### Admin Panel
```
http://localhost:3000/admin/dashboard
```

---

## 📊 Seed Data

Generate 100+ donors and 30 emergency requests:

```bash
node seed.js
```

| Data | Count |
|------|-------|
| **Donors** | 100 |
| **Emergency Requests** | 30 |
| **Blood Groups** | All 8 types |
| **Cities** | 30+ |
| **Default Password** | `password123` |

---

## 📧 Email System

### Email Triggers

| Action | Recipient | Subject |
|--------|-----------|---------|
| Registration | New User | Welcome to BloodConnect |
| Login | User | New Login Alert |
| Emergency Request | Matching Donors | Emergency Blood Request |
| Donation Recorded | Donor | Donation Confirmed |
| Forgot Password | User | Password Reset |
| Verification | Donor | Verification Update |

### Gmail Setup (For Email Notifications)
1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" → "Windows Computer" → Generate
4. Copy 16-digit code to `.env` → `EMAIL_PASS`

---

## 🏆 Donation Certificate

After recording a blood donation, donors receive a **printable certificate**:

- **Design**: Professional border with blood drop stamp
- **Details**: Name, blood group, units, hospital, date, certificate ID
- **Print**: One-click print button
- **Access**: Direct redirect after donation or from email link

```
/donor/certificate/:donationId
```

---

## 🛣️ API Routes

### Public Routes
```
GET  /                         Home Page
GET  /about                    About Page
GET  /contact                  Contact Page
POST /contact                  Submit Contact Form
GET  /donor/search             Search Donors
GET  /donor/profile/:id        View Donor Profile
GET  /emergency/create         Create Emergency Request
POST /emergency/create         Submit Emergency Request
GET  /emergency/requests       View All Emergency Requests
GET  /emergency/request/:id    View Request Details
```

### Auth Routes
```
GET  /auth/register            Registration Page
POST /auth/register            Register User
GET  /auth/login               Login Page
POST /auth/login               Login User
GET  /auth/logout              Logout
GET  /auth/forgot-password     Forgot Password Page
POST /auth/forgot-password     Send Reset Email
GET  /auth/reset-password/:token Reset Password Page
POST /auth/reset-password/:token Reset Password
```

### Donor Routes (Login Required)
```
GET  /donor/dashboard          Dashboard
GET  /donor/edit-profile       Edit Profile
POST /donor/edit-profile       Update Profile
POST /donor/add-donation       Record Donation
GET  /donor/certificate/:id    View Certificate
GET  /donor/search             Search Donors
GET  /donor/profile/:id        View Profile
```

### Admin Routes (Admin Login Required)
```
GET  /admin/dashboard          Admin Dashboard
GET  /admin/users              Manage Users
POST /admin/verify-donor/:id   Verify Donor
POST /admin/reject-donor/:id   Reject Donor
POST /admin/toggle-block/:id   Block/Unblock User
POST /admin/delete-user/:id    Delete User
GET  /admin/emergency-requests View Requests
POST /admin/update-request/:id Update Request Status
GET  /admin/contacts           View Messages
POST /admin/mark-read/:id      Mark Message as Read
```

### Special Routes (Development)
```
GET  /make-admin/:email        Make User Admin (Dev Only)
```

---

## 📁 Project Structure

```
BloodDonationPortal/
├── config/              # Database & email configuration
│   ├── db.js            # MongoDB connection
│   └── email.js         # Nodemailer setup & templates
├── controllers/         # Route controllers
│   ├── authController.js    # Register, login, forgot password
│   ├── donorController.js   # Dashboard, profile, donation, certificate
│   ├── adminController.js   # User management, requests, messages
│   └── emergencyController.js # Create & manage emergency requests
├── middleware/          # Custom middleware
│   ├── auth.js         # JWT authentication & role authorization
│   └── upload.js       # Multer file upload configuration
├── models/             # MongoDB schemas
│   ├── User.js         # User/Donor schema with donation history
│   ├── EmergencyRequest.js # Emergency blood request schema
│   └── Contact.js      # Contact form message schema
├── routes/             # Express routes
│   ├── authRoutes.js
│   ├── donorRoutes.js
│   ├── adminRoutes.js
│   ├── emergencyRoutes.js
│   └── pageRoutes.js
├── views/              # EJS templates
│   ├── partials/       # Header & footer
│   ├── auth/           # Login, register, forgot/reset password
│   ├── donor/          # Dashboard, profile, search, certificate
│   ├── admin/          # Dashboard, users, requests, contacts
│   ├── emergency/      # Create, list, detail
│   └── pages/          # Home, about, contact, 404, 500
├── public/             # Static assets
│   ├── css/style.css
│   ├── js/main.js
│   └── images/         # Favicon & images
├── uploads/            # User uploaded files
│   ├── profiles/
│   └── documents/
├── utils/helpers.js    # Utility functions
├── app.js              # Express app setup
├── server.js           # Server entry point
├── seed.js             # Sample data generator (100 donors + 30 requests)
├── package.json        # Dependencies & scripts
├── .env                # Environment variables
└── README.md           # Documentation
```

---

## 🔒 Security

| Feature | Implementation |
|---------|----------------|
| Password Hashing | bcrypt with 10 salt rounds |
| Authentication | JWT with HTTP-only cookies |
| Session Management | express-session with secure cookies |
| Input Validation | express-validator on all forms |
| XSS Protection | xss-clean middleware |
| File Upload Security | Type & size validation (images/PDF, 5MB max) |
| Route Protection | Auth middleware with role-based access |
| MongoDB Security | Mongoose sanitization, parameterized queries |
| Cookie Security | HTTP-only, sameSite, path restricted |

---

## 🚢 Deployment

### Deploy to Render (Free)
1. Push code to GitHub
2. Go to [Render](https://render.com)
3. New Web Service → Connect GitHub repo
4. Set environment variables
5. Deploy

### Deploy to Railway (Free)
```bash
npm i -g @railway/cli
railway login
railway up
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **MongoDB Connection Error** | Check MongoDB is running or Atlas URI is correct |
| **Email Not Sending** | Use Gmail App Password, not normal password |
| **Page Not Loading** | Run `npm install`, check console for errors |
| **Login Not Persisting** | Clear browser cookies, check JWT_SECRET |
| **No Users in Admin** | Run `node seed.js` to generate sample data |
| **Nearby Requests Empty** | User city must match emergency request city |
| **Port Already in Use** | Change PORT in `.env` file |
| **Upload Fails** | Check `uploads/` folders exist |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 👤 Author

**Ankit Rajan**

- GitHub: [@Ankit-rajan](https://github.com/Ankit-rajan)
- Repository: [Blood-Donation-Portal](https://github.com/Ankit-rajan/Blood-Donation-Portal)
- Project: BloodConnect - Blood Donation Portal

---

## 🙏 Acknowledgments

- **Bootstrap** - CSS Framework
- **Font Awesome** - Icons
- **MongoDB** - Database
- **Nodemailer** - Email Service
- **All Blood Donors** - Real Life Heroes 🦸

---

<div align="center">
  <h2>🩸 Every Blood Donor is a Life Saver!</h2>
  <p><strong>BloodConnect</strong> - Connecting Donors, Saving Lives</p>
  <p>Made with ❤️ for humanity</p>
  <br>
  <a href="https://github.com/Ankit-rajan/Blood-Donation-Portal">⭐ Star this project</a> | 
  <a href="https://github.com/Ankit-rajan/Blood-Donation-Portal/fork">🔱 Fork this project</a>
</div>
