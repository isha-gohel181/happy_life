import mongoose from "mongoose";

const freeContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  contentType: {
    type: String,
    enum: ['pdf', 'class', 'test'],
    required: true
  },
  fileUrl: { type: String }, // For PDFs or MP4 videos
  videoUrl: { type: String }, // For YouTube/Vimeo/VdoCipher
  thumbnail: { type: String },
  isDownloadable: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  // Reference to FreeQuiz if contentType is 'test'
  freeQuiz: { type: mongoose.Schema.Types.ObjectId, ref: 'FreeQuiz' },
}, { timestamps: true });

const FreeContent = mongoose.models.FreeContent || mongoose.model('FreeContent', freeContentSchema);
export default FreeContent;
