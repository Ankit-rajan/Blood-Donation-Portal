const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load env vars
dotenv.config();

// Connect to MongoDB - Remove unsupported options
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bloodDonationPortal")
.then(() => {
    console.log("✅ MongoDB Connected Successfully");
})
.catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.log("⚠️  Server will run without database. Some features may not work.");
    console.log("💡 Make sure MongoDB is installed and running.");
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`\n📋 Available Routes:`);
    console.log(`   Home:    http://localhost:${PORT}`);
    console.log(`   Login:   http://localhost:${PORT}/auth/login`);
    console.log(`   Register: http://localhost:${PORT}/auth/register`);
    console.log(`   Search:  http://localhost:${PORT}/donor/search`);
    console.log(`   Emergency: http://localhost:${PORT}/emergency/create\n`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
