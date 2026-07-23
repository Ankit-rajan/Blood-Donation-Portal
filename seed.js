const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

// ============ SCHEMAS ============
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    bloodGroup: String,
    gender: String,
    dateOfBirth: Date,
    age: Number,
    address: String,
    city: String,
    state: String,
    pincode: String,
    lastDonationDate: Date,
    medicalStatus: { type: String, default: "healthy" },
    availability: { type: Boolean, default: true },
    profileImage: { type: String, default: "default-profile.png" },
    verificationStatus: { type: String, default: "verified" },
    role: { type: String, default: "user" },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    donationHistory: Array
}, { timestamps: true });

const emergencyRequestSchema = new mongoose.Schema({
    patientName: String,
    bloodGroup: String,
    hospitalName: String,
    hospitalAddress: String,
    city: String,
    state: String,
    phone: String,
    urgencyLevel: String,
    unitsRequired: Number,
    additionalNotes: String,
    status: { type: String, default: "pending" },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const EmergencyRequest = mongoose.model("EmergencyRequest", emergencyRequestSchema);

// ============ EXTENDED DATA ============
const firstNames = [
    "Amit", "Priya", "Rahul", "Sneha", "Vikram", "Neha", "Rajesh", "Anjali", 
    "Suresh", "Deepika", "Manoj", "Pooja", "Karan", "Ritu", "Sanjay", "Megha", 
    "Arun", "Kavita", "Vijay", "Sunita", "Rohit", "Shweta", "Nitin", "Ananya", 
    "Gaurav", "Divya", "Sachin", "Preeti", "Ajay", "Rashmi", "Ravi", "Nisha", 
    "Dinesh", "Pallavi", "Ashok", "Lata", "Prakash", "Rekha", "Mahesh", "Seema",
    "Alok", "Rituraj", "Hemant", "Mamta", "Yogesh", "Komal", "Naveen", "Sapna",
    "Dharmesh", "Richa", "Bhavesh", "Hina", "Chirag", "Vaishali", "Pankaj", "Bhavna"
];

const lastNames = [
    "Sharma", "Patel", "Kumar", "Singh", "Gupta", "Verma", "Reddy", "Nair", 
    "Joshi", "Mehta", "Chopra", "Malhotra", "Agarwal", "Desai", "Rao", "Iyer", 
    "Menon", "Pillai", "Das", "Sen", "Mishra", "Thakur", "Yadav", "Jain", "Shah",
    "Bose", "Chauhan", "Rawat", "Saxena", "Dubey", "Tiwari", "Pandey", "Kulkarni"
];

const cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Jaipur", 
    "Lucknow", "Kolkata", "Ahmedabad", "Indore", "Bhopal", "Nagpur", "Surat", 
    "Thane", "Chandigarh", "Ludhiana", "Agra", "Vadodara", "Nashik",
    "Patna", "Ranchi", "Guwahati", "Bhubaneswar", "Dehradun", "Shimla",
    "Panaji", "Kochi", "Mysore", "Visakhapatnam"
];

const states = [
    "Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu", "Maharashtra", 
    "Rajasthan", "Uttar Pradesh", "West Bengal", "Gujarat", "Madhya Pradesh", 
    "Madhya Pradesh", "Maharashtra", "Gujarat", "Maharashtra", "Punjab", "Punjab", 
    "Uttar Pradesh", "Gujarat", "Maharashtra", "Bihar", "Jharkhand", "Assam", 
    "Odisha", "Uttarakhand", "Himachal Pradesh", "Goa", "Kerala", "Karnataka", 
    "Andhra Pradesh"
];

const pincodes = [
    "400001", "110001", "560001", "500001", "600001", "411001", "302001", 
    "226001", "700001", "380001", "452001", "462001", "440001", "395001", 
    "400601", "160001", "141001", "282001", "390001", "422001",
    "800001", "834001", "781001", "751001", "248001", "171001",
    "403001", "682001", "570001", "530001"
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genders = ["male", "female", "other"];
const hospitals = [
    "Apollo Hospital", "Fortis Healthcare", "AIIMS", "Max Super Speciality", 
    "KEM Hospital", "Lilavati Hospital", "Medanta", "Narayana Health", 
    "Manipal Hospital", "Ruby Hall Clinic", "Jaslok Hospital", "Hinduja Hospital", 
    "Wockhardt Hospital", "Columbia Asia", "Sahyadri Hospital", "Artemis Hospital",
    "Paras Hospital", "BLK Hospital", "Sir Ganga Ram", "Bombay Hospital"
];

const addresses = [
    "MG Road", "Park Street", "Link Road", "Main Street", "Church Street", 
    "Market Area", "Ring Road", "Brigade Road", "FC Road", "JM Road",
    "Station Road", "College Road", "Mall Road", "Beach Road", "Hill Road"
];

const urgencyLevels = ["low", "medium", "high", "critical"];

const patientNames = [
    "Rajesh Kumar", "Baby Ananya", "Sunita Devi", "Mohammed Ali", "Gurpreet Singh",
    "Fatima Begum", "Lakshmi Narayan", "Sitaram Yadav", "Baby Riya", "John Mathew",
    "Kamala Devi", "Sardar Patel", "Chinmay Joshi", "Baby Arjun", "Zarina Khan",
    "Muthu Raman", "Geeta Sharma", "Baby Siya", "Harpreet Kaur", "Usman Sheikh",
    "Baby Krish", "Devendra Yadav", "Shabana Azmi", "Thomas George", "Baby Myra",
    "Narayan Murthy", "Baby Avyan", "Kaushalya Devi", "Ramesh Tandon", "Baby Pari"
];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPhone() {
    const phones = ["98", "97", "87", "88", "76", "70", "99", "90", "95", "85"];
    return getRandom(phones) + Math.floor(Math.random() * 100000000 + 10000000).toString();
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// ============ SEED FUNCTION ============
async function seedDatabase() {
    try {
        console.log("\n🔄 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bloodDonationPortal");
        console.log("✅ Connected to MongoDB\n");

        // Clear existing data
        console.log("🗑️  Clearing existing data...");
        await User.deleteMany({ role: "user" });
        await EmergencyRequest.deleteMany({});
        console.log("✅ Cleared existing users and requests\n");

        const password = await bcrypt.hash("password123", 10);
        const users = [];
        const userIds = [];

        // ============ CREATE 100 DONORS ============
        console.log("👤 Creating 100 random donors...");
        
        for (let i = 1; i <= 100; i++) {
            const firstName = getRandom(firstNames);
            const lastName = getRandom(lastNames);
            const cityIndex = Math.floor(Math.random() * cities.length);
            const bloodGroup = getRandom(bloodGroups);
            const userId = new mongoose.Types.ObjectId();
            userIds.push(userId);
            
            users.push({
                _id: userId,
                name: `${firstName} ${lastName}`,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`,
                password: password,
                phone: getRandomPhone(),
                bloodGroup: bloodGroup,
                gender: getRandom(genders),
                dateOfBirth: getRandomDate(new Date(1985, 0, 1), new Date(2005, 11, 31)),
                age: Math.floor(Math.random() * 30) + 20,
                address: `${Math.floor(Math.random() * 500) + 1}, ${getRandom(addresses)}`,
                city: cities[cityIndex],
                state: states[cityIndex],
                pincode: pincodes[cityIndex],
                lastDonationDate: getRandomDate(new Date(2023, 0, 1), new Date(2025, 6, 1)),
                medicalStatus: getRandom(["healthy", "healthy", "healthy", "under_medication"]),
                availability: Math.random() > 0.2,
                verificationStatus: getRandom(["verified", "verified", "verified", "pending"]),
                donationHistory: Math.random() > 0.3 ? [{
                    date: getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)),
                    units: Math.floor(Math.random() * 3) + 1,
                    hospital: getRandom(hospitals),
                    patientName: `${getRandom(firstNames)} ${getRandom(lastNames)}`
                }] : []
            });
        }

        const createdUsers = await User.insertMany(users);
        console.log(`✅ Created ${createdUsers.length} donors!`);
        
        // ============ CREATE 30 EMERGENCY REQUESTS ============
        console.log("\n🚨 Creating 30 emergency requests...");
        
        const requests = [];
        
        for (let i = 0; i < 30; i++) {
            const cityIndex = Math.floor(Math.random() * cities.length);
            const bloodGroup = getRandom(bloodGroups);
            const urgency = Math.random() > 0.5 ? "critical" : getRandom(["high", "medium", "low"]);
            const units = Math.floor(Math.random() * 5) + 1;
            const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
            const status = i < 22 ? "pending" : getRandom(["fulfilled", "cancelled"]);
            
            requests.push({
                patientName: patientNames[i],
                bloodGroup: bloodGroup,
                hospitalName: getRandom(hospitals),
                hospitalAddress: `${Math.floor(Math.random() * 500) + 1}, ${getRandom(addresses)}, ${cities[cityIndex]}`,
                city: cities[cityIndex],
                state: states[cityIndex],
                phone: getRandomPhone(),
                urgencyLevel: urgency,
                unitsRequired: units,
                additionalNotes: getRandom([
                    "Patient needs blood urgently. Please respond quickly.",
                    "Post-surgery blood requirement. Any matching donor please contact.",
                    "Accident victim needs immediate blood transfusion.",
                    "Cancer patient requires regular blood supply.",
                    "Emergency C-section, blood needed immediately.",
                    "Thalassemia patient, needs blood every month."
                ]),
                status: status,
                requestedBy: randomUser
            });
        }

        const createdRequests = await EmergencyRequest.insertMany(requests);
        console.log(`✅ Created ${createdRequests.length} emergency requests!`);

        // ============ PRINT SUMMARY ============
        console.log("\n" + "=".repeat(60));
        console.log("              SEED DATA SUMMARY");
        console.log("=".repeat(60));
        
        console.log("\n👤 TOTAL DONORS: 100");
        console.log("-".repeat(40));
        
        let totalVerified = 0;
        bloodGroups.forEach(group => {
            const count = users.filter(u => u.bloodGroup === group).length;
            const verified = users.filter(u => u.bloodGroup === group && u.verificationStatus === "verified").length;
            totalVerified += verified;
            console.log(`  ${group}: ${count} donors (${verified} verified)`);
        });
        console.log(`  Total Verified: ${totalVerified}/100`);

        const available = users.filter(u => u.availability).length;
        console.log(`\n  Available Donors: ${available}`);
        console.log(`  Unavailable: ${100 - available}`);

        console.log("\n📍 TOP 15 CITIES:");
        console.log("-".repeat(40));
        const cityCounts = {};
        users.forEach(u => {
            cityCounts[u.city] = (cityCounts[u.city] || 0) + 1;
        });
        Object.entries(cityCounts).sort((a,b) => b[1] - a[1]).slice(0, 15).forEach(([city, count]) => {
            console.log(`  ${city}: ${count} donors`);
        });

        console.log("\n🚨 EMERGENCY REQUESTS: 30");
        console.log("-".repeat(40));
        const pendingReq = requests.filter(r => r.status === "pending").length;
        const fulfilledReq = requests.filter(r => r.status === "fulfilled").length;
        const cancelledReq = requests.filter(r => r.status === "cancelled").length;
        console.log(`  Pending: ${pendingReq}`);
        console.log(`  Fulfilled: ${fulfilledReq}`);
        console.log(`  Cancelled: ${cancelledReq}`);
        
        const criticalReq = requests.filter(r => r.urgencyLevel === "critical").length;
        const highReq = requests.filter(r => r.urgencyLevel === "high").length;
        const mediumReq = requests.filter(r => r.urgencyLevel === "medium").length;
        console.log(`  Critical: ${criticalReq}`);
        console.log(`  High: ${highReq}`);
        console.log(`  Medium: ${mediumReq}`);
        console.log(`  Low: ${30 - criticalReq - highReq - mediumReq}`);

        console.log("\n🔑 LOGIN INFO:");
        console.log("-".repeat(40));
        console.log("  Email examples:");
        console.log("    amit.sharma1@gmail.com");
        console.log("    priya.patel2@gmail.com");
        console.log("    rahul.kumar3@gmail.com");
        console.log("  Password (all): password123");
        console.log("  Admin Code: admin123");

        console.log("\n📊 TOTAL DATA:");
        console.log("-".repeat(40));
        console.log(`  Donors: 100`);
        console.log(`  Emergency Requests: 30`);
        console.log(`  Total Records: 130`);

        console.log("\n" + "=".repeat(60));
        console.log("      ✅ DATABASE SEEDED SUCCESSFULLY!");
        console.log("=".repeat(60) + "\n");

        mongoose.connection.close();

    } catch (error) {
        console.error("\n❌ Error seeding database:", error.message);
        mongoose.connection.close();
        process.exit(1);
    }
}

seedDatabase();
