import mongoose from "mongoose";

const testSeriesAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testSeries: { type: mongoose.Schema.Types.ObjectId, ref: 'TestSeries', required: true },
  startedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' }
}, { timestamps: true });

const TestSeriesAttempt = mongoose.models.TestSeriesAttempt || mongoose.model('TestSeriesAttempt', testSeriesAttemptSchema);
export default TestSeriesAttempt;
