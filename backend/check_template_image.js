import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
const templates = await mongoose.connection.db.collection('certificatetemplates').find().toArray();
for (const t of templates) {
  console.log('Template:', t.title, '| image:', t.image);
  if (t.image) {
    const fullPath = path.join(process.cwd(), t.image);
    console.log('  Full path:', fullPath, '| Exists:', fs.existsSync(fullPath));
    if (fs.existsSync(fullPath)) {
      const ext = path.extname(fullPath).toLowerCase();
      console.log('  Extension:', ext, '| Size:', fs.statSync(fullPath).size);
    }
  }
}
await mongoose.disconnect();
