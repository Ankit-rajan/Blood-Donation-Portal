# 🩸 BloodConnect - Blood Donation Portal

A professional, full-stack Blood Donation Portal built with Node.js, Express.js, MongoDB, and EJS. This platform connects blood donors with recipients, manages emergency requests, and helps save lives.

![Blood Donation](https://img.shields.io/badge/Blood%20Donation-Save%20Lives-red)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green)
![License](https://img.shields.io/badge/License-ISC-blue)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Admin Access](#admin-access)
- [Seed Data](#seed-data)
- [API Routes](#api-routes)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Public Features
- **Home Page**: Attractive landing page with stats, blood group search
- **Donor Search**: Find donors by blood group, city, state, pincode
- **Emergency Request**: Create urgent blood requests with email notifications
- **User Registration/Login**: Secure authentication with JWT
- **Contact Form**: Send messages to administrators
- **About Page**: Blood donation info, compatibility chart, eligibility

### Donor Features
- **Dashboard**: Personal dashboard with profile completion tracker
- **Profile Management**: Update personal info, medical status, availability
- **Document Upload**: Government ID, blood reports, profile photo
- **Donation History**: Track all blood donations
- **Nearby Alerts**: View emergency requests in your area

### Admin Features
- **Statistics Dashboard**: Total users, donors, requests, messages
- **User Management**: Verify/reject/block/delete users
- **Emergency Management**: Track and update request status
- **Contact Messages**: View and manage messages

### Email Notifications
- Welcome email on registration
- Emergency alerts to matching donors
- Verification approved/rejected notifications

## 💻 Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 5.x |
| **Database** | MongoDB 7.0+ with Mongoose ODM |
| **Auth** | JWT + bcrypt |
| **Template** | EJS (Server-Side Rendering) |
| **CSS** | Bootstrap 5.3 |
| **Icons** | Font Awesome 6.4 |
| **Email** | Nodemailer |
| **Upload** | Multer |
| **Validation** | express-validator |

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- Gmail Account (for email notifications - optional)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/Ankit-rajan/Blood-Donation-Portal.git
cd Blood-Donation-Portal
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bloodDonationPortal
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
BASE_URL=http://localhost:3000
```

4. **Create upload directories**
```bash
mkdir uploads\profiles uploads\documents
```

5. **Start MongoDB** (if using local)
```bash
mongod
```

6. **Run the application**
```bash
npm run dev
```

7. **Open browser**
```
http://localhost:3000
```

## 👑 Admin Access

### Method 1: Admin Secret Code (EASIEST)

1. Register at: http://localhost:3000/auth/register
2. Fill all details
3. In **"Admin Code"** field, enter: **`admin123`**
4. Complete registration → Direct Admin Dashboard!

**Default Admin Code:** `admin123`

### Method 2: Make Existing User Admin

Visit this URL with your registered email:
```
http://localhost:3000/make-admin/your_email@gmail.com
```

### Method 3: MongoDB Atlas (Manual)

1. MongoDB Atlas → Browse Collections → users
2. Find your user → Edit → Change `role` to `"admin"`

### Admin Panel URL
```
http://localhost:3000/admin/dashboard
```

## 📊 Seed Data

Generate 100+ sample donors and 30 emergency requests:

```bash
node seed.js
```

| Data | Count |
|------|-------|
| Donors | 100 |
| Emergency Requests | 30 |
| Blood Groups | All 8 types |
| Cities | 30+ |

**Default Password (all users):** `password123`

## 🛣️ API Routes

### Public Routes
```
GET  /                         Home Page
GET  /about                    About Page
GET  /contact                  Contact Page
POST /contact                  Submit Contact
GET  /donor/search             Search Donors
GET  /donor/profile/:id        View Donor Profile
GET  /emergency/create         Create Emergency
POST /emergency/create         Submit Emergency
GET  /emergency/requests       View All Requests
```

### Auth Routes
```
GET/POST /auth/register        Registration
GET/POST /auth/login           Login
GET      /auth/logout          Logout
GET/POST /auth/forgot-password Forgot Password
GET/POST /auth/reset-password  Reset Password
```

### Donor Routes (Login Required)
```
GET  /donor/dashboard          Dashboard
GET  /donor/edit-profile       Edit Profile
POST /donor/edit-profile       Update Profile
POST /donor/add-donation       Record Donation
```

### Admin Routes (Admin Login Required)
```
GET  /admin/dashboard          Admin Dashboard
GET  /admin/users              User Management
POST /admin/verify-donor/:id   Verify Donor
POST /admin/reject-donor/:id   Reject Donor
POST /admin/toggle-block/:id   Block/Unblock User
POST /admin/delete-user/:id    Delete User
GET  /admin/emergency-requests Emergency Requests
GET  /admin/contacts           Contact Messages
```

## 🔒 Security

- Password hashing with bcrypt (10 salt rounds)
- JWT authentication with HTTP-only cookies
- Input validation with express-validator
- XSS protection
- Role-based access control (user/admin)
- Protected routes with middleware
- File upload validation (type & size)

## 🚢 Deployment

### Deploy to Render (Free)
1. Push to GitHub
2. Connect repo to [Render](https://render.com)
3. Create Web Service
4. Set environment variables
5. Deploy

### Deploy to Railway (Free)
```bash
npm i -g @railway/cli
railway login
railway up
```

## 📁 Project Structure

```
BloodDonationPortal/
├── config/              # Database & email config
├── controllers/         # Route controllers (auth, donor, admin, emergency)
├── middleware/           # Auth & upload middleware
├── models/              # MongoDB schemas (User, EmergencyRequest, Contact)
├── routes/              # Express routes
├── views/               # EJS templates
│   ├── partials/        # Header & footer
│   ├── auth/            # Login, register, forgot password
│   ├── donor/           # Dashboard, profile, search
│   ├── admin/           # Dashboard, users, requests, contacts
│   ├── emergency/       # Create, list, detail
│   └── pages/           # Home, about, contact, 404, 500
├── public/              # CSS, JS, images, favicon
├── uploads/             # User uploads (profiles, documents)
├── utils/               # Helper functions
├── app.js               # Express app setup
├── server.js            # Server entry point
├── seed.js              # Sample data generator
├── package.json         # Dependencies
├── .env                 # Environment variables
└── README.md            # Documentation
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB Connection Error | Ensure MongoDB is running or Atlas URI is correct |
| Email Not Sending | Check Gmail credentials in .env, use App Password |
| Page Not Loading | Run `npm install`, check server console |
| Login Not Working | Clear browser cookies, check user not blocked |
| Port Already in Use | Change PORT in .env file |

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Ankit Rajan**

- GitHub: [@Ankit-rajan](https://github.com/Ankit-rajan)
- Repository: [Blood-Donation-Portal](https://github.com/Ankit-rajan/Blood-Donation-Portal)

## 🙏 Acknowledgments

- Bootstrap for the CSS framework
- Font Awesome for icons
- MongoDB for the database
- All blood donors who save lives

---

<div align="center">
  <h3>🩸 Every blood donor is a life saver!</h3>
  <p>Made with ❤️ for humanity</p>
</div>
