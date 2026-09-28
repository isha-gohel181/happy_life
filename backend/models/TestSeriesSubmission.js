import mongoose from "mongoose";

const testSeriesSubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testSeries: { type: mongoose.Schema.Types.ObjectId, ref: 'TestSeries', required: true },
  answers: [{
    question: { type: String, required: true },
    selectedOption: { 
      type: String, 
      required: false, 
      enum: ['A', 'B', 'C', 'D', 'E', null, ''] 
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

const TestSeriesSubmission = mongoose.models.TestSeriesSubmission || mongoose.model('TestSeriesSubmission', testSeriesSubmissionSchema);
export default TestSeriesSubmission;
