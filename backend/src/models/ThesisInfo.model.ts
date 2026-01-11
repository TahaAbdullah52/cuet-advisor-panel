import mongoose, { Document, Schema } from 'mongoose';

export interface IThesisInfo extends Document {
  _id: mongoose.Types.ObjectId;
  student_id: mongoose.Types.ObjectId;
  title: string;
  abstract?: string;
  supervisor: string;
  co_supervisor?: string;
  start_date?: Date;
  defense_date?: Date;
  status: 'not_started' | 'ongoing' | 'submitted' | 'defended' | 'completed';
  grade?: string;
  progress_percentage?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ThesisInfoSchema = new Schema<IThesisInfo>(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
      unique: true
    },
    title: {
      type: String,
      required: [true, 'Thesis title is required'],
      trim: true
    },
    abstract: {
      type: String,
      trim: true
    },
    supervisor: {
      type: String,
      required: [true, 'Supervisor is required'],
      trim: true
    },
    co_supervisor: {
      type: String,
      trim: true
    },
    start_date: {
      type: Date
    },
    defense_date: {
      type: Date
    },
    status: {
      type: String,
      required: true,
      enum: ['not_started', 'ongoing', 'submitted', 'defended', 'completed'],
      default: 'not_started'
    },
    grade: {
      type: String,
      trim: true,
      uppercase: true
    },
    progress_percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster queries
ThesisInfoSchema.index({ student_id: 1 });
ThesisInfoSchema.index({ status: 1 });

const ThesisInfo = mongoose.model<IThesisInfo>('ThesisInfo', ThesisInfoSchema);

export default ThesisInfo;
