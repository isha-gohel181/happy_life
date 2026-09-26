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

const freeQuizSchema = new mongoose.Schema({
  quizTitle: { type: String, required: true },
  quizDescription: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  timeLimit: { type: Number, required: true },
  level: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  showLeaderboard: { type: Boolean, default: true },
  showQuizResult: { type: Boolean, default: true },
  sections: [sectionSchema],
  passMark: { type: Number, required: true },
  maxAttempts: { type: Number, default: 3 }
}, { timestamps: true });

const FreeQuiz = mongoose.models.FreeQuiz || mongoose.model('FreeQuiz', freeQuizSchema);
export default FreeQuiz;
