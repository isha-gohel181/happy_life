import mongoose from "mongoose";

const courseFeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  description: { type: String, required: true },
  attachment: { type: String, required: false }
}, { timestamps: true });

// Ensure a user can only have one feedback per course
courseFeedbackSchema.index({ user: 1, course: 1 }, { unique: true });

const CourseFeedback = mongoose.models.CourseFeedback || mongoose.model('CourseFeedback', courseFeedbackSchema);
export default CourseFeedback;
