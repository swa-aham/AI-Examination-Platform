import mongoose, { Schema, Document } from 'mongoose';

export interface ISubjectProgress {
  subject: string;
  examCount: number;
  averageScore: number;
  strengths: string[];
  weaknesses: string[];
  analysis: string;
}

export interface IMonthlyReport extends Document {
  student: mongoose.Types.ObjectId;
  month: number; // 1-12
  year: number;
  examResults: mongoose.Types.ObjectId[]; // References to StudentAnswer documents
  subjectProgress: ISubjectProgress[];
  overallScore: number;
  overallPercentage: number;
  monthlyAssessment: string;
  progressEvaluation: string;
  recommendedActions: string[];
  improvementFromPreviousMonth?: number;
  teacherComments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectProgressSchema: Schema = new Schema({
  subject: { type: String, required: true },
  examCount: { type: Number, required: true },
  averageScore: { type: Number, required: true },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  analysis: { type: String, required: true }
});

const MonthlyReportSchema: Schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    examResults: [{ type: Schema.Types.ObjectId, ref: 'StudentAnswer' }],
    subjectProgress: [SubjectProgressSchema],
    overallScore: { type: Number, required: true },
    overallPercentage: { type: Number, required: true },
    monthlyAssessment: { type: String, required: true },
    progressEvaluation: { type: String, required: true },
    recommendedActions: [{ type: String }],
    improvementFromPreviousMonth: { type: Number },
    teacherComments: { type: String }
  },
  { timestamps: true }
);

// Create a unique compound index to prevent duplicate monthly reports
MonthlyReportSchema.index({ student: 1, month: 1, year: 1 }, { unique: true });

// Check if model is already defined to prevent overwriting during hot reloads
export default mongoose.models.MonthlyReport || mongoose.model<IMonthlyReport>('MonthlyReport', MonthlyReportSchema);
