import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
  grade?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], required: true },
    grade: { type: String, required: function() { return this.role === 'student'; } },
  },
  { timestamps: true }
);

// Check if model is already defined to prevent overwriting during hot reloads
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
