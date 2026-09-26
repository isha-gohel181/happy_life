import mongoose from "mongoose";

const freeQuizSubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freeQuiz: { type: mongoose.Schema.Types.ObjectId, ref: 'FreeQuiz', required: true },
  answers: [{
    question: { type: String, required: true },
    selectedOption: { 
      type: String, 
      required: true, 
      enum: ['A', 'B', 'C', 'D', 'E'] 
    }
  }],
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  totalQuestions: { type: Number, required: true },
  totalCorrectQuestions: { type: Number, required: true },
  totalWrongQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  timeTaken: { type: Number, required: false, default: 0 },
  is_completed: { type: Boolean, required: true },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const FreeQuizSubmission = mongoose.models.FreeQuizSubmission || mongoose.model('FreeQuizSubmission', freeQuizSubmissionSchema);
export default FreeQuizSubmission;
