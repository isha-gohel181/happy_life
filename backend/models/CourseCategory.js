import mongoose from "mongoose";

const courseCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active', 
    required: true 
  },
  image: { type: String, trim: true }, // Added image field to store filename
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Index for efficient querying by slug is already created by unique: true on slug

export default mongoose.model('CourseCategory', courseCategorySchema);