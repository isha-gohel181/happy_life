import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const emailArg = process.argv[2] || 'admin@osacademy.com';
const passwordArg = process.argv[3] || 'Admin@123';
const nameArg = process.argv[4] || 'Admin User';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/osacademy';

console.log(`Connecting to MongoDB at: ${MONGO_URI}...`);
await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
console.log('✅ Connected to MongoDB');

const userSchema = new mongoose.Schema({
  fullName: { type: String, trim: true, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'instructor', 'student', 'news_editor', 'super_admin'], default: 'admin' },
  is_verify: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  isActive: { type: Boolean, default: true },
  profilePicture: { type: String, default: 'default-profile.png' }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const normalizedEmail = emailArg.trim().toLowerCase();
const hashedPassword = await bcrypt.hash(passwordArg, 10);

let existingUser = await User.findOne({ email: normalizedEmail });

if (existingUser) {
  existingUser.password = hashedPassword;
  existingUser.role = 'admin';
  existingUser.status = 'active';
  existingUser.isActive = true;
  existingUser.is_verify = true;
  existingUser.emailVerified = true;
  if (nameArg) existingUser.fullName = nameArg;
  await existingUser.save();
  console.log('\n✅ Existing user updated to ADMIN successfully:');
} else {
  const newUser = await User.create({
    fullName: nameArg,
    email: normalizedEmail,
    password: hashedPassword,
    role: 'admin',
    is_verify: true,
    emailVerified: true,
    status: 'active',
    isActive: true
  });
  console.log('\n✅ New ADMIN user created successfully:');
}

console.log(`----------------------------------------`);
console.log(`📧 Email   : ${normalizedEmail}`);
console.log(`🔑 Password: ${passwordArg}`);
console.log(`👤 Name    : ${nameArg}`);
console.log(`🛡️ Role    : admin`);
console.log(`----------------------------------------\n`);

await mongoose.disconnect();
console.log('Disconnected from MongoDB.');
