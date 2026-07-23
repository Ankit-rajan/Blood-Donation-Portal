




# 🩸 BloodConnect - Blood Donation Portal

A professional, full-stack Blood Donation Portal built with Node.js, Express.js, MongoDB, and EJS. This platform connects blood donors with recipients, manages emergency requests, and helps save lives.

![Blood Donation](https://img.shields.io/badge/Blood%20Donation-Save%20Lives-red)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green)
![License](https://img.shields.io/badge/License-ISC-blue)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Screenshots](#screenshots)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## ✨ Features

### 🏠 Public Features
- **Home Page**: Attractive landing page with stats and call-to-action
- **Donor Search**: Find donors by blood group, city, state, pincode
- **Emergency Request**: Create urgent blood requests with email notifications
- **User Registration/Login**: Secure authentication system
- **Contact Form**: Send messages to administrators
- **About Page**: Information about the organization

### 👤 Donor Features
- **Dashboard**: Personal dashboard with stats and profile completion
- **Profile Management**: Update personal information, medical status
- **Document Upload**: Upload government ID, blood reports, profile photo
- **Donation History**: Track all blood donations
- **Availability Status**: Toggle availability for donations
- **Nearby Alerts**: View emergency requests in your area

### 👑 Admin Features
- **Admin Dashboard**: Complete statistics and analytics
- **User Management**: View, verify, block, delete users
- **Donor Verification**: Verify/reject donor documents
- **Emergency Management**: Track and update emergency requests
- **Message Management**: View and respond to contact messages
- **Blood Group Analytics**: See distribution of blood groups

### 🔔 Email Notifications
- Welcome email on registration
- Emergency alerts to matching donors
- Verification approved/rejected notifications
- Password reset emails

### 🛡️ Security Features
- JWT Authentication with secure cookies
- Password hashing with bcrypt
- Input validation with express-validator
- XSS protection
- Session management
- Protected routes with middleware
- MongoDB injection prevention

## 💻 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Database**: MongoDB 7.0+ with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **Email**: Nodemailer with Gmail SMTP
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: xss-clean, secure cookies

### Frontend
- **Template Engine**: EJS (Server-Side Rendering)
- **CSS Framework**: Bootstrap 5.3
- **Icons**: Font Awesome 6.4
- **Animations**: AOS (Animate on Scroll)
- **JavaScript**: Vanilla JS

### DevOps & Tools
- **Version Control**: Git
- **Environment**: dotenv
- **Session Store**: connect-mongo
- **Development**: nodemon

## 📁 Project Structure

```
BloodDonationPortal/
│
├── config/                      # Configuration files
│   ├── db.js                    # MongoDB connection
│   └── email.js                 # Email service & templates
│
├── controllers/                 # Route controllers
│   ├── authController.js        # Authentication logic
│   ├── donorController.js       # Donor operations
│   ├── adminController.js       # Admin operations
│   └── emergencyController.js   # Emergency requests
│
├── middleware/                  # Custom middleware
│   ├── auth.js                  # JWT authentication
│   └── upload.js                # File upload handling
│
├── models/                      # Database models
│   ├── User.js                  # User/Donor schema
│   ├── EmergencyRequest.js      # Emergency request schema
│   └── Contact.js               # Contact message schema
│
├── routes/                      # Route definitions
│   ├── authRoutes.js            # Auth routes
│   ├── donorRoutes.js           # Donor routes
│   ├── adminRoutes.js           # Admin routes
│   ├── emergencyRoutes.js       # Emergency routes
│   └── pageRoutes.js            # Public page routes
│
├── views/                       # EJS templates
│   ├── partials/                # Reusable components
│   │   ├── header.ejs           # Navigation & head
│   │   └── footer.ejs           # Footer & scripts
│   ├── auth/                    # Authentication pages
│   │   ├── login.ejs
│   │   ├── register.ejs
│   │   ├── forgot-password.ejs
│   │   └── reset-password.ejs
│   ├── donor/                   # Donor pages
│   │   ├── dashboard.ejs
│   │   ├── edit-profile.ejs
│   │   ├── search.ejs
│   │   └── profile.ejs
│   ├── admin/                   # Admin pages
│   │   ├── dashboard.ejs
│   │   ├── users.ejs
│   │   ├── emergency-requests.ejs
│   │   └── contacts.ejs
│   ├── emergency/               # Emergency pages
│   │   ├── create.ejs
│   │   ├── requests.ejs
│   │   └── request-detail.ejs
│   └── pages/                   # Static pages
│       ├── home.ejs
│       ├── about.ejs
│       ├── contact.ejs
│       ├── 404.ejs
│       └── 500.ejs
│
├── public/                      # Static assets
│   ├── css/
│   │   └── style.css            # Custom styles
│   ├── js/
│   │   └── main.js              # Custom JavaScript
│   └── images/                  # Images & SVGs
│
├── uploads/                     # User uploads
│   ├── profiles/                # Profile pictures
│   └── documents/               # ID & blood reports
│
├── utils/
│   └── helpers.js               # Utility functions
│
├── app.js                       # Express app setup
├── server.js                    # Server entry point
├── package.json                 # Dependencies
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
└── README.md                    # Documentation
```

## 🚀 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (v7.0 or higher) - Local or Atlas
- **Git** (optional)
- **Gmail Account** (for email notifications)

### Step-by-Step Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/blood-donation-portal.git
cd blood-donation-portal
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
# Copy the example env file
cp .env.example .env

# Or create manually
touch .env
```

4. **Configure .env file**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bloodDonationPortal
JWT_SECRET=your_super_secret_jwt_key_here
SESSION_SECRET=your_session_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
NODE_ENV=development
BASE_URL=http://localhost:3000
```

5. **Create upload directories**
```bash
mkdir -p uploads/profiles uploads/documents
```

6. **Start MongoDB** (if using local)
```bash
# Windows
net start MongoDB

# Mac/Linux
mongod --dbpath /path/to/data/db
```

7. **Run the application**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

8. **Access the application**
```
Open browser: http://localhost:3000
```


## 👑 Admin Access

### Method 1: Admin Secret Code (EASIEST)

Register with the secret admin code to become admin directly:

1. Go to: http://localhost:3000/auth/register
2. Fill all registration details (Name, Email, Password, Phone, Blood Group, City)
3. In the **"Admin Code"** field, enter: **`admin123`**
4. Complete registration
5. You will be automatically redirected to **Admin Dashboard**!

**Default Admin Code:** `admin123`

**To Change Admin Code:** Add this line to `.env` file:
```env
ADMIN_SECRET_CODE=your_custom_admin_code
```

### Method 2: Make Existing User Admin via URL

If you already have a registered account, simply visit this URL in your browser:

```
http://localhost:3000/make-admin/your_email@gmail.com
```

**Example:**
```
http://localhost:3000/make-admin/admin@test.com
```

Replace `your_email@gmail.com` with your actual registered email address. You will see a confirmation message. Then login again to access admin panel.

**Note:** This route is for development purposes only. Remove in production.

### Method 3: MongoDB Atlas (Manual Database Edit)

If the above methods don't work, you can manually change user role in database:

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Login to your account
3. Click on your cluster
4. Click **"Browse Collections"** button
5. Select database: `bloodDonationPortal`
6. Select collection: `users`
7. Find your user by email
8. Click the **Edit (pencil)** icon
9. Find `role` field and change value from `"user"` to `"admin"`
10. Click **"Update"** to save
11. Login again - you are now admin!

### Admin Panel Access

After becoming admin, login and access:

```
http://localhost:3000/admin/dashboard
```

Or directly navigate to admin panel after admin login.

### Admin Dashboard Features

| Feature | Description |
|---------|-------------|
| **Statistics** | View total users, verified donors, active donors, pending verifications |
| **User Management** | View all users, verify donors, reject donors, block/unblock users, delete users |
| **Emergency Requests** | View all blood requests, update status (pending/fulfilled/cancelled) |
| **Contact Messages** | Read messages from contact form, mark as read |
| **Blood Group Data** | See distribution of blood groups among donors |

### Quick Admin Actions

- **Verify a Donor:** Admin Dashboard → Users → Click "Verify" button
- **Block a User:** Admin Dashboard → Users → Click "Toggle Block" button
- **Delete a User:** Admin Dashboard → Users → Click "Delete" button
- **View Emergency Requests:** Admin Dashboard → Emergency Requests
- **Read Messages:** Admin Dashboard → Contacts

### Security Notes

- Admin code should be kept secret
- Change default admin code in production
- Remove `/make-admin` route in production
- Admin panel is protected with JWT authentication
- Only users with `role: "admin"` can access admin routes
- Regular users cannot access admin panel even if they know the URL





## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/bloodDonationPortal` |
| `JWT_SECRET` | JWT signing secret | Required |
| `SESSION_SECRET` | Session secret key | Required |
| `EMAIL_USER` | Gmail address for emails | Required for emails |
| `EMAIL_PASS` | Gmail app password | Required for emails |
| `NODE_ENV` | Environment mode | `development` |
| `BASE_URL` | Application base URL | `http://localhost:3000` |

### Gmail App Password Setup
1. Go to Google Account Settings
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail"
5. Use this password in `.env` file

## 📖 Usage

### Creating an Admin User
1. Register a normal user account
2. Connect to MongoDB:
```bash
mongosh
use bloodDonationPortal
db.users.updateOne({email: "admin@example.com"}, {$set: {role: "admin"}})
```
3. Login with admin credentials
4. Access admin panel at `/admin/dashboard`

### Donor Verification Process
1. Donor registers and completes profile
2. Uploads government ID and blood report
3. Admin reviews documents
4. Admin approves or rejects verification
5. Verified donors appear in public search

### Emergency Blood Request
1. Anyone can create emergency request
2. System finds matching donors in same city
3. Email alerts sent to matching donors
4. Donors can view and respond to requests
5. Admin tracks request status

## 🛣️ API Routes

### Public Routes
```
GET  /                         - Home page
GET  /about                    - About page
GET  /contact                  - Contact page
POST /contact                  - Submit contact form
GET  /donor/search             - Search donors
GET  /donor/profile/:id        - View donor profile
GET  /emergency/create         - Emergency form
POST /emergency/create         - Submit emergency
GET  /emergency/requests       - View emergencies
```

### Authentication Routes
```
GET  /auth/register            - Registration form
POST /auth/register            - Register user
GET  /auth/login               - Login form
POST /auth/login               - Login user
GET  /auth/logout              - Logout user
GET  /auth/forgot-password     - Forgot password form
POST /auth/forgot-password     - Send reset email
GET  /auth/reset-password/:token - Reset password form
POST /auth/reset-password/:token - Reset password
```

### Donor Routes (Protected)
```
GET  /donor/dashboard          - Donor dashboard
GET  /donor/edit-profile       - Edit profile form
POST /donor/edit-profile       - Update profile
POST /donor/add-donation       - Add donation record
```

### Admin Routes (Protected)
```
GET  /admin/dashboard          - Admin dashboard
GET  /admin/users              - Manage users
POST /admin/verify-donor/:id   - Verify donor
POST /admin/reject-donor/:id   - Reject donor
POST /admin/toggle-block/:id   - Block/unblock user
POST /admin/delete-user/:id    - Delete user
GET  /admin/emergency-requests - View emergencies
POST /admin/update-request/:id - Update status
GET  /admin/contacts           - View messages
POST /admin/mark-read/:id      - Mark as read
```

## 📸 Screenshots

### Home Page
- Hero section with CTA
- Statistics counter
- Feature cards
- Blood group display
- Responsive design

### Donor Dashboard
- Profile completion bar
- Quick stats
- Blood group badge
- Nearby requests
- Donation form

### Admin Panel
- Statistics overview
- User management table
- Emergency request tracking
- Contact messages

### Search Donors
- Filter by blood group
- City/State/Pincode search
- Donor cards with info
- Pagination

## 🔒 Security

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: Secure token-based auth
- **Session Management**: MongoDB session store
- **XSS Protection**: xss-clean middleware
- **Input Validation**: express-validator
- **File Upload Security**: Type & size validation
- **Secure Cookies**: HTTP-only, signed
- **MongoDB Injection Prevention**: Mongoose sanitization
- **Protected Routes**: Role-based access control
- **Rate Limiting**: Express rate limit (recommended)

## 🚢 Deployment

### Deploy to Render
1. Create account on [Render](https://render.com)
2. Connect GitHub repository
3. Create Web Service
4. Set environment variables
5. Deploy

### Deploy to Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Deploy to Heroku (Alternative)
```bash
heroku create blood-donation-portal
git push heroku main
heroku config:set NODE_ENV=production
```

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 Development Notes

### Best Practices Used
- ✅ MVC Architecture
- ✅ DRY (Don't Repeat Yourself)
- ✅ Clean Code Principles
- ✅ Proper Error Handling
- ✅ Flash Messages
- ✅ RESTful Routes
- ✅ Optimized Queries
- ✅ Mobile-First Design
- ✅ Semantic HTML
- ✅ Accessibility

### Performance Optimizations
- MongoDB indexes on frequently queried fields
- Static file caching
- Compressed responses
- Minified assets (production)

## 🐛 Known Issues

- Email functionality requires valid Gmail credentials
- MongoDB must be running for the application to work
- Profile images stored locally (use cloud storage for production)

## 📅 Roadmap

- [ ] Blood bank inventory management
- [ ] Blood donation camps
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (Socket.io)
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] SMS notifications
- [ ] QR code for donor profiles
- [ ] Export data (PDF/Excel)
- [ ] Dark mode

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **ANKIT** - *Initial work* - [GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- Font Awesome for icons
- Bootstrap team for the framework
- MongoDB for the database
- All blood donors who save lives

## 📧 Contact

- **Email**: info@bloodconnect.com
- **Website**: https://bloodconnect.com
- **GitHub**: https://github.com/yourusername/blood-donation-portal

---


