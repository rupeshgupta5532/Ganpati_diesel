const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ganpati_diesel';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Please set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file.");
  process.exit(1);
}

// Define the Admin Schema explicitly for the script
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'ADMIN' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Avoid model recompilation error
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    console.log(`Checking for existing admin with email: ${ADMIN_EMAIL}`);
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (existingAdmin) {
      console.log('Admin already exists. Updating credentials...');
      existingAdmin.passwordHash = passwordHash;
      await existingAdmin.save();
      console.log('Admin credentials updated successfully.');
    } else {
      console.log('Creating new admin...');
      const newAdmin = new Admin({
        name: 'Super Admin',
        email: ADMIN_EMAIL,
        passwordHash: passwordHash,
        role: 'ADMIN',
        isActive: true
      });
      await newAdmin.save();
      console.log('New admin created successfully.');
    }

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedAdmin();
