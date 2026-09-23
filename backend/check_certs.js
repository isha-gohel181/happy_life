import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
const collections = await mongoose.connection.db.listCollections().toArray();
console.log('Collections:', collections.map(c => c.name));
for (const c of collections) {
  if (c.name.toLowerCase().includes('cert')) {
    const count = await mongoose.connection.db.collection(c.name).countDocuments();
    const sample = await mongoose.connection.db.collection(c.name).find().limit(2).toArray();
    console.log(`\n${c.name} (${count} docs):`, JSON.stringify(sample, null, 2));
  }
}
await mongoose.disconnect();
