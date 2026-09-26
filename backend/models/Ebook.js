import mongoose from "mongoose";

const ebookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  coverImage: { type: String, required: true },
  fileUrl: { type: String, required: true }, // URL to PDF/EPUB file
  author: { type: String, trim: true },
  pages: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Ebook = mongoose.models.Ebook || mongoose.model('Ebook', ebookSchema);
export default Ebook;
