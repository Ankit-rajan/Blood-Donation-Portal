const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

dotenv.config();

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || "blood_donation_secret_key_2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// GLOBAL MIDDLEWARE: Check JWT token on EVERY request
app.use(async (req, res, next) => {
    try {
        let token;
        
        // Check cookie first
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        // Check Authorization header
        else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "blood_donation_jwt_secret_key_2024_secure");
            const user = await User.findById(decoded.id);
            
            if (user && !user.isBlocked) {
                req.user = user;
                res.locals.user = user;
            }
        }
    } catch (err) {
        // Token invalid or expired - ignore
    }
    
    // Flash messages
    res.locals.success_msg = req.session.success_msg || "";
    res.locals.error_msg = req.session.error_msg || "";
    delete req.session.success_msg;
    delete req.session.error_msg;
    
    next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
const pageRoutes = require("./routes/pageRoutes");
const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");

// Use routes
app.use("/", pageRoutes);
app.use("/auth", authRoutes);
app.use("/donor", donorRoutes);
app.use("/admin", adminRoutes);
app.use("/emergency", emergencyRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render("pages/404", { 
        title: "Page Not Found", 
        user: req.user || null 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(500).render("pages/500", { 
        title: "Server Error", 
        user: req.user || null 
    });
});

module.exports = app;
