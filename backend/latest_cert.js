import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
const certs = await mongoose.connection.db.collection('certificates').find().sort({ _id: -1 }).limit(5).toArray();
for (const c of certs) {
  const user = await mongoose.connection.db.collection('users').findOne({ _id: c.user_id }, { projection: { email: 1, fullName: 1 } });
  console.log('ID:', c._id.toString(), '| Serial:', c.serial_number, '| URL:', c.certificate_url ? 'YES' : 'NO', '| User:', user?.email, user?.fullName, '| Status:', c.status);
}
await mongoose.disconnect();
