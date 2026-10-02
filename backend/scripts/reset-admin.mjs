import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ishagohel181:JHf4FanNi8VCBZz0@cluster0.pmyvsgz.mongodb.net/happy_life?retryWrites=true&w=majority&appName=Cluster0';

async function resetAdmin() {
  console.log('Connecting to MongoDB at:', MONGO_URI);
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 30000 });
  console.log('✅ Connected to MongoDB');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Admin@123', salt);

  const admins = [
    {
      fullName: 'Happy Life Admin',
      email: 'admin@happylife.com',
      password: hashedPassword,
      role: 'admin',
      is_verify: true,
      emailVerified: true,
      status: 'active',
      isActive: true,
      profilePicture: 'default-profile.png'
    },
    {
      fullName: 'Administrator',
      email: 'admin@osacademy.com',
      password: hashedPassword,
      role: 'admin',
      is_verify: true,
      emailVerified: true,
      status: 'active',
      isActive: true,
      profilePicture: 'default-profile.png'
    }
  ];

  for (const adminData of admins) {
    let user = await User.findOne({ email: adminData.email.toLowerCase() });
    if (user) {
      user.password = adminData.password;
      user.role = 'admin';
      user.is_verify = true;
      user.emailVerified = true;
      user.status = 'active';
      user.isActive = true;
      user.fullName = adminData.fullName;
      await user.save();
      console.log(`✅ Updated admin user: ${adminData.email}`);
    } else {
      user = await User.create(adminData);
      console.log(`✅ Created new admin user: ${adminData.email}`);
    }
  }

  console.log('\n=============================================');
  console.log('🎉 Admin accounts reset successfully in happy_life database:');
  console.log('---------------------------------------------');
  console.log('📧 Primary Email  : admin@happylife.com');
  console.log('📧 Secondary Email: admin@osacademy.com');
  console.log('🔑 Password       : Admin@123');
  console.log('🛡️ Role           : admin');
  console.log('=============================================\n');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

resetAdmin().catch(err => {
  console.error('❌ Error resetting admin:', err);
  process.exit(1);
});
