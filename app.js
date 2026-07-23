const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const xss = require('xss-clean');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const pageRoutes = require('./routes/pageRoutes');

const app = express();

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000
    }
}));

// Data sanitization against XSS
app.use(xss());

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.session.success_msg;
    res.locals.error_msg = req.session.error_msg;
    res.locals.error = req.session.error;
    res.locals.user = req.user || null;
    delete req.session.success_msg;
    delete req.session.error_msg;
    delete req.session.error;
    next();
});

// Routes
app.use('/', pageRoutes);
app.use('/auth', authRoutes);
app.use('/donor', donorRoutes);
app.use('/admin', adminRoutes);
app.use('/emergency', emergencyRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render('pages/404', {
        title: 'Page Not Found',
        user: req.user
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('pages/500', {
        title: 'Server Error',
        user: req.user
    });
});

module.exports = app;