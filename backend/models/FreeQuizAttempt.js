import mongoose from "mongoose";

const freeQuizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freeQuiz: { type: mongoose.Schema.Types.ObjectId, ref: 'FreeQuiz', required: true },
  startedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' }
}, { timestamps: true });

const FreeQuizAttempt = mongoose.models.FreeQuizAttempt || mongoose.model('FreeQuizAttempt', freeQuizAttemptSchema);
export default FreeQuizAttempt;
