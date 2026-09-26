import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  label: { 
    type: String, 
    required: true, 
    enum: ['A', 'B', 'C', 'D'] 
  },
  text: { 
    type: String, 
    required: true 
  }
}, { _id: false });

const questionSchema = new mongoose.Schema({
  instruction: { type: String, default: "" },
  question: { type: String, required: true },
  explanation: { type: String, default: "" },
  options: [optionSchema],
  correctAnswer: { 
    type: String, 
    required: true, 
    enum: ['A', 'B', 'C', 'D'] 
  },
  marks: { type: Number, required: true, default: 1 }
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  sectionTitle: { type: String, required: true },
  sectionDescription: { type: String },
  questions: [questionSchema]
}, { _id: false });

const testSeriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, default: 0 },
  totalMarks: { type: Number, required: true },
  timeLimit: { type: Number, required: true }, // Time limit in minutes
  level: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  showLeaderboard: { type: Boolean, default: true },
  showResult: { type: Boolean, default: true },
  sections: [sectionSchema],
  passMark: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  coverImage: { type: String, default: "" }
}, { timestamps: true });

const TestSeries = mongoose.models.TestSeries || mongoose.model('TestSeries', testSeriesSchema);
export default TestSeries;
