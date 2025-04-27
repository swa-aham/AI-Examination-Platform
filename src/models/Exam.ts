import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  id: string;
  type: 'single-word' | 'short-answer' | 'long-answer';
  text: string;
  marks: number;
  correctAnswer?: string; // For single-word questions
}

export interface IExam extends Document {
  title: string;
  subject: string;
  grade: string;
  timeLimit: number; // in minutes
  questions: IQuestion[];
  instructions: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['single-word', 'short-answer', 'long-answer'], 
    required: true 
  },
  text: { type: String, required: true },
  marks: { type: Number, required: true },
  correctAnswer: { type: String } // Only for single-word questions
});

const ExamSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    timeLimit: { type: Number, required: true },
    questions: [QuestionSchema],
    instructions: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

// Check if model is already defined to prevent overwriting during hot reloads
export default mongoose.models.Exam || mongoose.model<IExam>('Exam', ExamSchema);
