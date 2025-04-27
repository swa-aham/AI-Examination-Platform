import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionAnswer extends Document {
  questionId: string;
  answer: string;
  marks: number;
  possibleMarks: number;
  feedback: string;
  graded: boolean;
  gradingDetails?: Record<string, any>; // Details from AI grading
}

export interface IStudentAnswer extends Document {
  student: mongoose.Types.ObjectId;
  exam: mongoose.Types.ObjectId;
  answers: IQuestionAnswer[];
  startTime: Date;
  submissionTime: Date;
  totalMarks: number;
  totalPossibleMarks: number;
  feedback: string;
  overallFeedback?: {
    strengthAreas: string[];
    improvementAreas: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const QuestionAnswerSchema: Schema = new Schema({
  questionId: { type: String, required: true },
  answer: { type: String, required: true },
  marks: { type: Number, default: 0 },
  possibleMarks: { type: Number, required: true },
  feedback: { type: String, default: '' },
  graded: { type: Boolean, default: false },
  gradingDetails: { type: Schema.Types.Mixed }
});

const StudentAnswerSchema: Schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    exam: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    answers: [QuestionAnswerSchema],
    startTime: { type: Date, required: true },
    submissionTime: { type: Date, required: true },
    totalMarks: { type: Number, default: 0 },
    totalPossibleMarks: { type: Number, required: true },
    feedback: { type: String, default: '' },
    overallFeedback: {
      strengthAreas: [{ type: String }],
      improvementAreas: [{ type: String }]
    }
  },
  { timestamps: true }
);

// Create a unique compound index to prevent duplicate submissions
StudentAnswerSchema.index({ student: 1, exam: 1 }, { unique: true });

// Check if model is already defined to prevent overwriting during hot reloads
export default mongoose.models.StudentAnswer || mongoose.model<IStudentAnswer>('StudentAnswer', StudentAnswerSchema);
