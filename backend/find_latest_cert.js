import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
const assign = await mongoose.connection.db.collection('certificateassigns').find().sort({ _id: -1 }).limit(1).toArray();
console.log(assign[0]?._id?.toString() || 'none');
await mongoose.disconnect();
