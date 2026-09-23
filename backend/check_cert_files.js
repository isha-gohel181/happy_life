import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
const certs = await mongoose.connection.db.collection('certificates').find({ certificate_url: { $ne: '' } }).sort({ _id: -1 }).toArray();
for (const c of certs) {
  const fullPath = path.join(process.cwd(), c.certificate_url);
  const exists = fs.existsSync(fullPath);
  const user = await mongoose.connection.db.collection('users').findOne({ _id: c.user_id }, { projection: { email: 1, fullName: 1 } });
  console.log(c._id.toString(), '|', user?.email, '|', c.certificate_url, '| FILE_EXISTS:', exists);
}
await mongoose.disconnect();
